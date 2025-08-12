import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";

type AnyNode = any;

interface ComponentItem {
  id: string;
  name: string;
  type: string;
  absoluteBoundingBox?: { x: number; y: number; width: number; height: number };
  children?: AnyNode[];
  node: AnyNode; // original node
}

function rgbaFromFill(fill: any): string | undefined {
  if (!fill) return undefined;
  if (fill.type === "SOLID" && fill.color) {
    const r = Math.round(fill.color.r * 255);
    const g = Math.round(fill.color.g * 255);
    const b = Math.round(fill.color.b * 255);
    const a = fill.opacity ?? fill.color.a ?? 1;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  return undefined;
}

/**
 * Find "root" frame/node to use as reference for coordinates.
 * We search page children and prefer any node with absoluteBoundingBox + children (FRAME or INSTANCE).
 */
function findRootFrame(documentNode: AnyNode): AnyNode | null {
  if (!documentNode) return null;
  // pages are children of the document
  const pages = documentNode.children ?? [];
  for (const page of pages) {
    // find first node inside page with absoluteBoundingBox and children (FRAME, INSTANCE)
    const found = searchNode(page, (n) => {
      return !!n.absoluteBoundingBox && (n.children?.length ?? 0) > 0;
    });
    if (found) return found;
  }
  // fallback to any node with absoluteBoundingBox
  const anyFound = searchNode(documentNode, (n) => !!n.absoluteBoundingBox);
  return anyFound;
}

function searchNode(node: AnyNode, predicate: (n: AnyNode) => boolean): AnyNode | null {
  if (!node) return null;
  if (predicate(node)) return node;
  if (node.children && node.children.length) {
    for (const child of node.children) {
      const r = searchNode(child, predicate);
      if (r) return r;
    }
  }
  return null;
}

function collectItems(node: AnyNode, items: ComponentItem[]) {
  if (!node) return;
  const typesToCollect = new Set(["INSTANCE", "COMPONENT", "FRAME", "RECTANGLE", "TEXT"]);
  // collect nodes that have absoluteBoundingBox (visible elements) and are of interesting type
  if (node.absoluteBoundingBox && typesToCollect.has(node.type)) {
    items.push({
      id: node.id,
      name: node.name,
      type: node.type,
      absoluteBoundingBox: node.absoluteBoundingBox,
      children: node.children ?? [],
      node,
    });
  }
  if (node.children && node.children.length) {
    for (const child of node.children) collectItems(child, items);
  }
}

export const FigmaParsedView: React.FC<{ figmaData: any }> = ({ figmaData }) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  // thumbnail (string) + fallback
  const thumbnailUrl: string | undefined = figmaData?.thumbnailUrl;

  // find the root frame / container that we will use as coordinate origin
  const rootFrame = useMemo(() => {
    if (!figmaData?.document) return null;
    return findRootFrame(figmaData.document);
  }, [figmaData]);

  // all components/items inside the rootFrame (collected recursively)
  const components = useMemo(() => {
    if (!rootFrame) return [] as ComponentItem[];
    const items: ComponentItem[] = [];
    collectItems(rootFrame, items);
    // keep unique by id (just in case) and sort by y/x for predictable order
    const uniq = new Map<string, ComponentItem>();
    items.forEach((it) => uniq.set(it.id, it));
    const arr = Array.from(uniq.values()).sort((a, b) => {
      const ay = a.absoluteBoundingBox?.y ?? 0;
      const by = b.absoluteBoundingBox?.y ?? 0;
      const ax = a.absoluteBoundingBox?.x ?? 0;
      const bx = b.absoluteBoundingBox?.x ?? 0;
      if (ay !== by) return ay - by;
      return ax - bx;
    });
    return arr;
  }, [rootFrame]);

  // Build hierarchical groups for the RIGHT panel:
  // - top level groups = direct children of rootFrame that have children
  // - each group contains its child items (we'll map by scanning children of the group)
  const groups = useMemo(() => {
    if (!rootFrame) return [];
    const directChildren = rootFrame.children ?? [];
    const result: {
      id: string;
      name: string;
      children: ComponentItem[];
    }[] = [];

    for (const child of directChildren) {
      // identify group-like nodes
      if (child.absoluteBoundingBox && (child.children?.length ?? 0) > 0) {
        // collect items inside this child
        const inside: ComponentItem[] = [];
        collectItems(child, inside);
        // remove the group itself from its own children list (if collectItems added it)
        const filtered = inside.filter((it) => it.id !== child.id);
        result.push({
          id: child.id,
          name: child.name || child.type,
          children: filtered,
        });
      }
    }

    // If none found (defensive), create a fallback group with all components
    if (result.length === 0) {
      result.push({
        id: rootFrame.id || "root",
        name: rootFrame.name || "Root",
        children: components,
      });
    }

    return result;
  }, [rootFrame, components]);

  // measure displayed thumbnail size when image loads or window resizes
  useEffect(() => {
    const img = imgRef.current;
    const update = () => {
      if (!img || !wrapperRef.current) return;
      // clientWidth/clientHeight reflect displayed size
      setDisplaySize({ width: img.clientWidth, height: img.clientHeight || img.clientWidth * 0.6 });
    };
    if (img) {
      if (img.complete) {
        update();
      } else {
        img.addEventListener("load", update);
      }
    }
    window.addEventListener("resize", update);
    return () => {
      if (img) img.removeEventListener("load", update);
      window.removeEventListener("resize", update);
    };
  }, [thumbnailUrl]);

  if (!figmaData) {
    return (
      <Box p={3}>
        <Typography color="text.secondary">No Figma data to display</Typography>
      </Box>
    );
  }

  // fallback frame box to avoid divide-by-zero
  const frameBox = rootFrame?.absoluteBoundingBox ?? { x: 0, y: 0, width: 1, height: 1 };
  const originalWidth = frameBox.width || 1;
  const originalHeight = frameBox.height || 1;

  // compute scale from original frame -> displayed thumbnail
  const scaleX = displaySize.width ? displaySize.width / originalWidth : 1;
  const scaleY = displaySize.height ? displaySize.height / originalHeight : 1;

  // helper to compute displayed coords from original coords
  const toDisplayed = (box: { x: number; y: number; width: number; height: number }) => {
    const relX = box.x - frameBox.x;
    const relY = box.y - frameBox.y;
    return {
      left: relX * scaleX,
      top: relY * scaleY,
      width: box.width * scaleX,
      height: box.height * scaleY,
    };
  };

  return (
    <Grid container spacing={2}>
      {/* Left: Full thumbnail with overlays */}
      <Grid item xs={12} md={6}>
        <Box
          ref={wrapperRef}
          sx={{
            position: "relative",
            width: "100%",
            border: "1px solid #ddd",
            borderRadius: 1,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          {thumbnailUrl ? (
            <img
              ref={imgRef}
              src={thumbnailUrl}
              alt="Figma Thumbnail"
              style={{ width: "100%", height: "auto", display: "block", userSelect: "none" }}
            />
          ) : (
            <Box sx={{ width: "100%", height: 400, background: "#f5f5f5" }} />
          )}

          {/* overlays */}
          {components.map((comp) => {
            if (!comp.absoluteBoundingBox) return null;
            const disp = toDisplayed(comp.absoluteBoundingBox);
            const isSelected = comp.id === selectedId;
            const isHovered = comp.id === hoverId;
            return (
              <Box
                key={comp.id}
                onMouseEnter={() => setHoverId(comp.id)}
                onMouseLeave={() => setHoverId(null)}
                onClick={() => setSelectedId(comp.id)}
                sx={{
                  position: "absolute",
                  left: disp.left,
                  top: disp.top,
                  width: disp.width,
                  height: disp.height,
                  boxSizing: "border-box",
                  border: isSelected ? "3px solid rgba(255,85,0,0.95)" : isHovered ? "2px dashed rgba(33,150,243,0.95)" : "2px solid rgba(33,150,243,0.5)",
                  backgroundColor: isSelected ? "rgba(255,85,0,0.06)" : "transparent",
                  cursor: "pointer",
                  zIndex: isSelected ? 40 : 30,
                }}
                title={`${comp.name} (${comp.type})`}
              />
            );
          })}
        </Box>
      </Grid>

      {/* Right: hierarchical groups shown as a grid of preview cards */}
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Components & Instances
        </Typography>

        <Box>
          {groups.map((group) => (
            <Box key={group.id} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                {group.name}
              </Typography>

              <Grid container spacing={1}>
                {group.children.map((child) => {
                  // compute crop offsets for background-position
                  const box = child.absoluteBoundingBox;
                  if (!box) {
                    return (
                      <Grid item xs={6} sm={4} md={3} key={child.id}>
                        <Card variant="outlined" sx={{ p: 1 }}>
                          <CardContent sx={{ p: 1 }}>
                            <Typography variant="body2">{child.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {child.type}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  }

                  // displayed offsets inside the thumbnail
                  const relX = box.x - frameBox.x;
                  const relY = box.y - frameBox.y;
                  const sx = relX * scaleX;
                  const sy = relY * scaleY;
                  const sw = box.width * scaleX;
                  const sh = box.height * scaleY;

                  // preview size in the grid cell
                  const previewHeight = 100;
                  const previewWidth = 140;

                  // if thumbnail present, use it as background and offset to crop
                  const bgImage = thumbnailUrl ? `url(${thumbnailUrl})` : undefined;
                  const backgroundPosition = `${-Math.round(sx)}px ${-Math.round(sy)}px`;
                  const backgroundSize = `${Math.round(displaySize.width || 1)}px ${Math.round(displaySize.height || 1)}px`;

                  const fill = rgbaFromFill(child.node?.fills?.[0]) || undefined;
                  const textPreview = child.node?.characters ?? child.name;

                  const isSel = child.id === selectedId;

                  return (
                    <Grid item xs={6} sm={4} md={3} key={child.id}>
                      <Card
                        onMouseEnter={() => setHoverId(child.id)}
                        onMouseLeave={() => setHoverId(null)}
                        onClick={() => setSelectedId(child.id)}
                        sx={{
                          border: isSel ? "2px solid rgba(255,85,0,0.95)" : "1px solid #e0e0e0",
                          cursor: "pointer",
                          overflow: "hidden",
                        }}
                        variant="outlined"
                      >
                        <Box sx={{ height: previewHeight, width: "100%", position: "relative", background: "#fff" }}>
                          {bgImage ? (
                            <Box
                              sx={{
                                position: "absolute",
                                inset: 0,
                                backgroundImage: bgImage,
                                backgroundPosition,
                                backgroundSize,
                                backgroundRepeat: "no-repeat",
                                // show a frame area so crop is visible
                              }}
                            />
                          ) : (
                            <Box sx={{ position: "absolute", inset: 0, background: fill || "#f6f6f6" }} />
                          )}

                          {/* small overlay text */}
                          <Box
                            sx={{
                              position: "absolute",
                              left: 6,
                              bottom: 6,
                              background: "rgba(0,0,0,0.6)",
                              color: "#fff",
                              px: 0.5,
                              py: 0.25,
                              borderRadius: "4px",
                              fontSize: "0.75rem",
                            }}
                          >
                            {textPreview?.toString().slice(0, 28)}
                          </Box>
                        </Box>

                        <CardContent sx={{ p: 1 }}>
                          <Typography noWrap variant="body2" title={child.name}>
                            {child.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {child.type}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          ))}
        </Box>
      </Grid>
    </Grid>
  );
};

export default FigmaParsedView;
