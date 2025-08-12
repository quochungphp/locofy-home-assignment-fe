import { getServerUrl } from "../utils/envs";
import { Api } from "./api";
import { AuthSigninPayloadDto, DetectFigmaFileKeyPayload, FigmaFileResponseDto, UserResponseDto, UserSignUpPayloadDto } from "../domain/locofy-backend-interface";

class ServerApi extends Api{
  constructor() {
    super();
    this.baseUrl = getServerUrl()
    const headers = {
      "Content-Type": "application/json",
    } as any;

    this.setHeaders(headers);
  }
  async authSignIn(
    payload: AuthSigninPayloadDto
  ): Promise<UserResponseDto> {
    const response = await  this.post(`/auth`,payload);
    this.setTokensFromResponse(response);
    return response.data
  }

  async userSignUp(
    payload: UserSignUpPayloadDto
  ): Promise<UserResponseDto> {
    const response = await  this.post(`/users`,payload);
    this.setTokensFromResponse(response);
    return response.data
  }
  
  async detectFigmaFileKey(
    payload: DetectFigmaFileKeyPayload
  ): Promise<FigmaFileResponseDto> {
    const response = await this.post(`/figma/detect-file-key`, payload);
    return response.data;
  }

  async getFigmaFileByKeyAndVersion(
    figmaFileKey: string,
    version: number
  ): Promise<FigmaFileResponseDto> {
    const response = await this.get(`/figma/${figmaFileKey}`, { version });
    return response.data;
  }
}

export const serverApi = new ServerApi();
