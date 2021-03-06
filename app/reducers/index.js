import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import SignUpFormReducer from './SignUpFormReducer';
import MomFormReducer from './MomFormReducer';
import MomReducer from './MomReducer';
import ForgotPasswordFormReducer from './ForgotPasswordFormReducer';

export default combineReducers({
  auth: AuthReducer,
  signUpForm: SignUpFormReducer,
  momForm: MomFormReducer,
  moms: MomReducer,
  forgotPasswordForm: ForgotPasswordFormReducer
});
