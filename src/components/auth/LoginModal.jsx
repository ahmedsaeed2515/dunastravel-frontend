import AuthModal from './AuthModal';

/**
 * Backwards-compatible LoginModal wrapper forwarding to the unified AuthModal.
 */
const LoginModal = (props) => {
  return <AuthModal {...props} />;
};

export default LoginModal;
