import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { UserServiceBase } from "./base/user.service.base";
import { PasswordService } from "../auth/password.service";
import { UserFindUniqueArgs } from "./base/UserFindUniqueArgs";
import {User} from "./base/User";


@Injectable()
export class UserService extends UserServiceBase {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly passwordService: PasswordService
  ) {
    super(prisma, passwordService);
  }

  async resetPassword(args: UserFindUniqueArgs): Promise<User>{
    return this.prisma.user.update({
      where: args.where, data:{password:"123456"}
    });
  }
}
