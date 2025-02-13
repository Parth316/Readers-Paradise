import React,{ useState } from "react";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Email submitted:", email);
    
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-amber-50 px-4">
      <div className="w-full max-w-md rounded-2xl p-6">
      <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 text-left text-[#3f3d3c]">Forgot Password</h1>

        <p className="mb-6 text-center text-sm text-gray-600">
          Enter your email for the verification process, we will send a 4-digit code to your email.
        </p>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700">
            Enter Email
          </label>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-[#c1a36f] focus:outline-none focus:ring-1 focus:ring-[#c1a36f]"
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-slate-600 p-3 text-white hover:bg-[#c1a36f] hover:text-black transition duration-300"
            onClick={() => validateEmail(email)}
         >
            Continue
          </button>
        </form>
      </div>
      <div className="w-full md:w-1/2 py-20 flex items-center h-full justify-center">
                <img
                    src="../images/forgotpass.png"
                    alt="Illustration"
                    className="w-[200px] md:w-[250px] lg:w-[600px] h-auto mx-auto"
                />
            </div>
    </div>
  );
};

export default ForgotPassword;
