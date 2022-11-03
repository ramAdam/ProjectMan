import { ProjectCreateNestedManyWithoutUsersInput } from "./ProjectCreateNestedManyWithoutUsersInput";
import { InputJsonValue } from "../../types";
import { TaskCreateNestedManyWithoutUsersInput } from "./TaskCreateNestedManyWithoutUsersInput";

export type UserCreateInput = {
  firstName?: string | null;
  lastName?: string | null;
  password: string;
  projects?: ProjectCreateNestedManyWithoutUsersInput;
  roles: InputJsonValue;
  task?: TaskCreateNestedManyWithoutUsersInput;
  username: string;
};
