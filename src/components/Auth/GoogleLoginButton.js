import React from 'react';

const GoogleLoginButton = ({ label = "Sign in" }) => {
  const handleGoogleLogin = () => {
    // Redirect to your backend's Google auth initiation endpoint
    window.location.href = 'http://localhost:7000/api/users/google'; 
  };

  const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48"> {/* Your GoogleIcon SVG */}
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.657-3.657-11.303-8H6.393c3.56,8.023,12.04,14,21.607,14L24,44z" />
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.372,44,30.038,44,24C44,22.659,43.862,21.34,43.611,20.083z" />
    </svg>
  );

  return (
    <button
      onClick={handleGoogleLogin}
      type="button"
      className="w-full mt-6 flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300"
    >
      <GoogleIcon />
      <span className="font-medium text-gray-700">{label} with Google</span>
    </button>
  );
};

export default GoogleLoginButton;