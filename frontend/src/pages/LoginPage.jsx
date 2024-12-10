import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  const commands = [
    {
      prefix: "$",
      text: "Are u ready to dive deep into world of codes?",
      style: "",
    },
    { prefix: ">", text: "Yes...", style: "text-warning" },
    { prefix: ">", text: "Done!", style: "text-success" },
  ];

  const [currentCommand, setCurrentCommand] = useState("");
  const [displayedCommands, setDisplayedCommands] = useState([]);
  const typingSpeed = 50;

  useEffect(() => {
    let i = 0;
    let charIndex = 0;
    let timeoutId;

    function typeCommand() {
      if (i < commands.length) {
        const command = commands[i];
        const fullText = command.text;

        if (charIndex < fullText.length) {
          setCurrentCommand((prev) => prev + fullText[charIndex]);
          charIndex++;
          timeoutId = setTimeout(typeCommand, typingSpeed);
        } else {
          setDisplayedCommands((prev) => [...prev, { ...command }]);
          setCurrentCommand("");
          charIndex = 0;
          i++;
          timeoutId = setTimeout(typeCommand, 500); // Pause before next command
        }
      }
    }

    typeCommand();

    // Cleanup timeout on component unmount or re-render
    return () => clearTimeout(timeoutId);
  }, []); // Empty dependency ensures it runs only once

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-base-300">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden lg:flex flex-col justify-center items-center p-6 sm:p-12 bg-base-200">
        <div className="mockup-code w-4/5">
          {displayedCommands.map((command, index) => (
            <pre
              key={index}
              data-prefix={command.prefix}
              className={command.style}
            >
              <code>{command.text}</code>
            </pre>
          ))}
          {currentCommand && (
            <pre
              data-prefix={commands[displayedCommands.length]?.prefix}
              className={commands[displayedCommands.length]?.style}
            >
              <code>{currentCommand}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
