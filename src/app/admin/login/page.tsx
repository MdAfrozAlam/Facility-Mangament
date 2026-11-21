/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import "./page.css";
import Image from "next/image";
import Script from "next/script";
import qydra from "../../assets/img/qydra.png";
import Footer from "@/app/components/footer/Footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../schemas/loginSchema";
import { login } from "@/app/services/auth/authService";
import { storage } from "@/app/utils/storage/storage";
import {
  BarChart3,
  BriefcaseBusiness,
  Wrench,
  KeyRound,
  Eye,
  EyeOff,
  User,
  ShieldCheck,
  UsersRound,
  ArrowRight,
  CircleAlert,
  LoaderCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
        },
      ) => number;
    };
  }
}

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

// Same modules and icons as the admin sidebar.
const features = [
  {
    title: "Maintenance",
    description: "Plan, assign and close work orders faster",
    icon: Wrench,
    accent: "#4ade80",
  },
  {
    title: "Asset Management",
    description: "Track every asset across its lifecycle",
    icon: BriefcaseBusiness,
    accent: "#60a5fa",
  },
  {
    title: "Workplace Services",
    description: "Handle service requests and spaces with ease",
    icon: UsersRound,
    accent: "#fbbf24",
  },
  {
    title: "Reports & Insights",
    description: "Turn operational data into clear decisions",
    icon: BarChart3,
    accent: "#f472b6",
  },
];

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const {
    register,
    setValues,
    trigger,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema), mode: "onChange",
  });

  
   useEffect(()=>{
    setValues({username:"Admin", password:"Password123"})
    trigger()

  },[])
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [isRecaptchaScriptLoaded, setIsRecaptchaScriptLoaded] = useState(false);
  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const captchaWidgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (
      !recaptchaSiteKey ||
      !isRecaptchaScriptLoaded ||
      captchaWidgetIdRef.current !== null
    ) {
      return;
    }

    let attempts = 0;
    let timeoutId: number | undefined;

    const renderCaptcha = () => {
      const recaptcha = window.grecaptcha;

      if (
        !captchaContainerRef.current ||
        typeof recaptcha?.render !== "function"
      ) {
        attempts += 1;

        if (attempts < 100) {
          timeoutId = window.setTimeout(renderCaptcha, 50);
        }

        return;
      }

      captchaWidgetIdRef.current = recaptcha.render(captchaContainerRef.current, {
        sitekey: recaptchaSiteKey,
        callback: setCaptchaToken,
        "expired-callback": () => setCaptchaToken(""),
        "error-callback": () => setCaptchaToken(""),
      });
    };

    renderCaptcha();

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isRecaptchaScriptLoaded]);

 async function onSubmit(data: any) {
  if (!captchaToken) {
    setAuthError("Please complete the CAPTCHA.");
    return;
  }
   

  setAuthError("");
  setLoading(true);

  try {
    const response = await login({
      username: data.username,
      password: data.password,
    });

    console.log("Login response:", response);

    if (response.status === 200) {
      console.log("Login successful");

      // Later:
      // storage.setToken(response.data.token);
      // storage.setUser(response.data.user);
      const tenantId = response.data?.tenantId;
      sessionStorage.setItem("tenantId", tenantId);

      router.push("/admin/core/organization");
    }
  } catch (error: unknown) {
    console.error("Login failed:", error);

    if (axios.isAxiosError(error)) {
      router.push("/admin/core/organization");
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Invalid username or password. Please try again.";

      setAuthError(message);
    } else if (error instanceof Error) {
      setAuthError(error.message);
    } else {
      setAuthError("An error occurred during login.");
    }
  } finally {
    setLoading(false);
  }
}

  return (
    <main>
      <div className="login-page">
        <div className="right-section">
          <div className="login-panel">
            <div className="login-brand">
              <Image className="login-logo" src={qydra} alt="QAYDRA QFM" priority />
              <p className="login-tagline">Smarter Facilities, Healthier Spaces</p>
            </div>

            <div className="login-card">
              <div className="login-intro">
                <h2>Welcome back</h2>
                <p>Sign in to your account to continue</p>
              </div>

              {authError && (
                <div className="login-alert" role="alert">
                  <CircleAlert size={18} aria-hidden="true" />
                  <span>{authError}</span>
                </div>
              )}

              <form noValidate className="login-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="login-field">
                  <label htmlFor="username">Username</label>
                  <div className={`login-control${errors.username ? " has-error" : ""}`}>
                    <User className="login-control-icon" size={18} aria-hidden="true" />
                    <input
                      id="username"
                      type="text"
                      autoComplete="username"
                      placeholder="Enter your username"
                      aria-invalid={Boolean(errors.username)}
                      aria-describedby={errors.username ? "username-error" : undefined}
                      {...register("username")}
                    />
                  </div>
                  {errors.username && (
                    <p id="username-error" className="login-field-error">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div className="login-field">
                  <div className="login-label-row">
                    <label htmlFor="password">Password</label>
                    <button type="button" className="login-link">
                      Forgot password?
                    </button>
                  </div>
                  <div className={`login-control${errors.password ? " has-error" : ""}`}>
                    <KeyRound className="login-control-icon" size={18} aria-hidden="true" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={errors.password ? "password-error" : undefined}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      className="login-password-toggle"
                      onClick={() => setShowPassword((show) => !show)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="password-error" className="login-field-error">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {recaptchaSiteKey ? (
                  <>
                    <Script
                      id="google-recaptcha"
                      src="https://www.google.com/recaptcha/api.js?render=explicit"
                      strategy="afterInteractive"
                      onLoad={() => setIsRecaptchaScriptLoaded(true)}
                    />
                    <div className="login-captcha">
                      <div ref={captchaContainerRef} />
                    </div>
                  </>
                ) : (
                  <p className="login-captcha-message">
                    reCAPTCHA is not configured. Add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to .env.local.
                  </p>
                )}

                <button
                  type="submit"
                  className="login-btn"
                  disabled={loading || !isValid || !captchaToken || !recaptchaSiteKey}
                  aria-busy={loading}
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="login-spinner" size={20} aria-hidden="true" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight size={20} aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>

              {/* <p className="login-register">
                Don&apos;t have an account?{" "}
                <button type="button" className="login-link">
                  Register
                </button>
              </p> */}
            </div>

            <Footer />
          </div>
        </div>
        <div className="left-section mobile-hide">
          <div className="showcase">
            <div className="showcase-main">
              <div className="showcase-heading">
                <span className="showcase-eyebrow">
                  <span className="showcase-eyebrow-dot" aria-hidden="true" />
                  Facility Management Software
                </span>
                <h1 className="showcase-title">
                  Manage your facilities <span>with confidence</span>
                </h1>
                <p className="showcase-subtitle">
                  QAYDRA QFM helps you streamline operations, improve efficiency
                  and create better spaces for people.
                </p>
              </div>

              <ul className="showcase-features">
                {features.map(({ title, description, icon: Icon, accent }) => (
                  <li key={title} className="showcase-feature">
                    <span
                      className="showcase-feature-icon"
                      style={{ "--accent": accent } as React.CSSProperties}
                    >
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <div>
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <p className="showcase-note">
              <ShieldCheck size={16} aria-hidden="true" />
              Secure access for authorised personnel only
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
