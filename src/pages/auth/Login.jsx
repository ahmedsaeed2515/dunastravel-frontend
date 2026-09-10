import { useNavigate, useLocation } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import LoginModal from '../../components/auth/LoginModal';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    if (location.key !== 'default') {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{t('auth.loginTitle', 'Login | Dunas Travel')}</title>
      </Helmet>
      <LoginModal isOpen={true} onClose={handleClose} initialTab="login" />
    </div>
  );
};

export default Login;
