import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import { UserService } from "./user.service";
import { UserControllerBase } from "./base/user.controller.base";
import { UserWhereUniqueInput } from "./base/UserWhereUniqueInput";
import { User } from "./base/User";
import { NotFoundException, ForbiddenException } from "../errors";
import { AclValidateRequestInterceptor } from "../interceptors/aclValidateRequest.interceptor";

@swagger.ApiTags("users")
@common.Controller("users")
export class UserController extends UserControllerBase {
  constructor(
    protected readonly service: UserService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @common.Patch("/:id/password")
  @nestAccessControl.UseRoles({
    resource: "User",
    action: "update",
    possession: "any"
  })
  @swagger.ApiOkResponse({ type: User })
  @swagger.ApiNotFoundResponse({ type: NotFoundException})
  @swagger.ApiForbiddenResponse({ type: ForbiddenException })
  async resetPassword(@common.Param() params: UserWhereUniqueInput): Promise<User | null>{
    const result = await this.service.resetPassword({where:params});

    if(result == null){
      throw new NotFoundException(`No resource was found ${JSON.stringify(params)}`);
    } 
    return result;
  }
}
