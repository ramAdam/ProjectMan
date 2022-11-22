import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Role } from "nest-access-control";
// @ts-ignore
// eslint-disable-next-line
import { UserService } from "../user/user.service";
import { Credentials } from "./Credentials";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";
import { UserInfo } from "./UserInfo";
import { UserRoles } from "./UserRoles";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService
  ) {}

  async validateUser(
    username: string,
    password: string
  ): Promise<UserInfo | null> {
    const user = await this.userService.findOne({
      where: { username },
    });
    if (user && (await this.passwordService.compare(password, user.password))) {
      const { id, roles } = user;
      const roleList = roles as string[];
      return { id, username, roles: roleList };
    }
    return null;
  }
  async signUp(credentials: Credentials): Promise<UserInfo>{
    const {username, password} = credentials;
    const user = await this.userService.create({data:{username, password, roles:["taskUser"]}});
    if(!user){
      throw new UnauthorizedException("Could not create user!");
    }
    const accessToken = await this.tokenService.createToken({
      id:user.id,
      username,
      password
    })
    return{
      accessToken,
      username: user.username,
      id: user.id,
      roles: (user.roles as UserRoles).roles
    }
  }

  async login(credentials: Credentials): Promise<UserInfo> {
    const { username, password } = credentials;
    const user = await this.validateUser(
      credentials.username,
      credentials.password
    );
    if (!user) {
      throw new UnauthorizedException("The passed credentials are incorrect");
    }
    //@ts-ignore
    const accessToken = await this.tokenService.createToken({
      id: user.id,
      username,
      password,
    });
    return {
      accessToken,
      ...user,
    };
  }
}
