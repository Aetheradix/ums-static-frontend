declare namespace User {
  interface UserInfo {
    userName: string;
    permissions: Record<string, string[]>;
    fullName: string;
    subName: string;
    postingOffice: string;
    officeCode: number;
    officeTypeId: number;
    officeTypeLevelId: number;
    userLevelId?: number;
    roles: string[];
    divisionId: number;
    districtId: number;
    blockId: number;
    sankulId?: number;
    schoolId?: number;
  }

  type AuthState = 'getting-user-info' | 'sign-in-required' | 'signed-in';

  interface UserInfoState {
    user?: UserInfo;
    authState: AuthState;

    changeStateToSignedIn: (user: UserInfo) => void;
    changeStateToSignInRequired: () => void;
    changeStateToSignOut: () => void;
  }

  interface LoginForm {
    userName: string;
    password: string;
    captcha: string;
    captchaId: string;
    requestId: string;
  }
}
