import { useAuth, useSignIn, useSignUp, useSSO } from "@clerk/expo";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthButton } from "../components/auth/AuthButton";
import { AuthInput } from "../components/auth/AuthInput";
import { GoogleButton } from "../components/auth/GoogleButton";
import { HomeIndicator } from "../components/auth/HomeIndicator";
import { StatusBarMock } from "../components/auth/Icons";
import { HomeScreen } from "../components/home/HomeScreen";

WebBrowser.maybeCompleteAuthSession();

type AuthMode = "signIn" | "signUp" | "forgotPassword";
type AuthStep = "form" | "verifySignUp" | "verifySignIn" | "resetCode" | "newPassword";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Authentication failed. Please try again.";
}

export default function Index() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { signIn, fetchStatus: signInStatus } = useSignIn();
  const { signUp, fetchStatus: signUpStatus } = useSignUp();
  const { startSSOFlow } = useSSO();

  const [mode, setMode] = useState<AuthMode>("signIn");
  const [step, setStep] = useState<AuthStep>("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const isLoading = busy || signInStatus === "fetching" || signUpStatus === "fetching";

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setStep("form");
    setMessage("");
    setCode("");
  };

  const handleSignUp = async () => {
    setMessage("");
    setBusy(true);
    try {
      const [firstName, ...lastNameParts] = fullName.trim().split(/\s+/);
      const { error } = await signUp.password({
        emailAddress: email.trim(),
        password,
        ...(firstName ? { firstName, lastName: lastNameParts.join(" ") } : {}),
      });
      if (error) throw error;

      const { error: codeError } = await signUp.verifications.sendEmailCode();
      if (codeError) throw codeError;
      setStep("verifySignUp");
      setMessage(`We sent a verification code to ${email.trim()}.`);
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const handleSignIn = async () => {
    setMessage("");
    setBusy(true);
    try {
      const { error } = await signIn.password({
        emailAddress: email.trim(),
        password,
      });
      if (error) throw error;

      if (signIn.status === "complete") {
        const { error: finalizeError } = await signIn.finalize({
          navigate: () => router.replace("/"),
        });
        if (finalizeError) throw finalizeError;
      } else if (signIn.status === "needs_client_trust") {
        const { error: codeError } = await signIn.mfa.sendEmailCode();
        if (codeError) throw codeError;
        setStep("verifySignIn");
        setMessage("Check your email for a verification code.");
      } else if (signIn.status === "needs_second_factor") {
        setMessage("Your account requires another sign-in factor that this screen does not support yet.");
      } else {
        setMessage("Sign-in needs another step. Check the sign-in options enabled in your Clerk Dashboard.");
      }
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async () => {
    setMessage("");
    setBusy(true);
    try {
      const result = step === "verifySignUp"
        ? await signUp.verifications.verifyEmailCode({ code: code.trim() })
        : await signIn.mfa.verifyEmailCode({ code: code.trim() });
      if (result.error) throw result.error;

      if (step === "verifySignUp" && signUp.status === "complete") {
        const { error } = await signUp.finalize({
          navigate: () => router.replace("/"),
        });
        if (error) throw error;
      } else if (step === "verifySignIn" && signIn.status === "complete") {
        const { error } = await signIn.finalize({
          navigate: () => router.replace("/"),
        });
        if (error) throw error;
      } else {
        setMessage("That code did not complete authentication. Check the code and try again.");
      }
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const handleSendResetCode = async () => {
    setMessage("");
    setBusy(true);
    try {
      const { error: createError } = await signIn.create({ identifier: email.trim() });
      if (createError) throw createError;
      const { error } = await signIn.resetPasswordEmailCode.sendCode();
      if (error) throw error;
      setStep("resetCode");
      setMessage(`We sent a password reset code to ${email.trim()}.`);
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyResetCode = async () => {
    setMessage("");
    setBusy(true);
    try {
      const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code: code.trim() });
      if (error) throw error;
      setStep("newPassword");
      setMessage("");
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const handleResetPassword = async () => {
    setMessage("");
    setBusy(true);
    try {
      const { error } = await signIn.resetPasswordEmailCode.submitPassword({
        password,
        signOutOfOtherSessions: true,
      });
      if (error) throw error;
      if (signIn.status !== "complete") {
        setMessage("The password reset needs another verification step. Check your Clerk settings.");
        return;
      }
      const { error: finalizeError } = await signIn.finalize({
        navigate: () => router.replace("/"),
      });
      if (finalizeError) throw finalizeError;
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setMessage("");
    setBusy(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: Linking.createURL("/", { scheme: "myapp" }),
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      } else {
        setMessage("Google sign-in needs another step. Check your Clerk Google connection settings.");
      }
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (isSignedIn) {
    return <HomeScreen />;
  }

  const isVerificationStep = step === "verifySignUp" || step === "verifySignIn";
  const isReset = mode === "forgotPassword";
  const showGoogle = step === "form" && !isReset;

  const submit = () => {
    if (step === "verifySignUp" || step === "verifySignIn") return handleVerify();
    if (step === "resetCode") return handleVerifyResetCode();
    if (step === "newPassword") return handleResetPassword();
    if (mode === "signUp") return handleSignUp();
    if (mode === "forgotPassword") return handleSendResetCode();
    return handleSignIn();
  };

  const buttonTitle = isVerificationStep
    ? "Verify Email"
    : step === "resetCode"
      ? "Verify Code"
      : step === "newPassword"
        ? "Set New Password"
        : mode === "forgotPassword"
          ? "Send Reset Code"
          : mode === "signUp"
            ? "Create Account"
            : "Sign In";

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.page}>
        <StatusBarMock />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <Text style={styles.brand}>EZNW</Text>
            <Text style={styles.heading}>
              {isVerificationStep
                ? "Check your email"
                : step === "resetCode"
                  ? "Reset your password"
                  : step === "newPassword"
                    ? "Set a new password"
                    : isReset
                      ? "Forgot your password?"
                      : mode === "signUp"
                        ? "Create your account"
                        : "Welcome back"}
            </Text>
            <Text style={styles.subtitle}>
              {isVerificationStep || step === "resetCode"
                ? `Enter the code sent to ${email.trim()}`
                : step === "newPassword"
                  ? "Choose a new password for your account."
                  : isReset
                    ? "Enter your email and we’ll send a reset code."
                    : mode === "signUp"
                      ? "Join the community"
                      : "Sign in to continue"}
            </Text>

            {showGoogle && <GoogleButton onPress={handleGoogleSignIn} />}

            {showGoogle && (
              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.divider} />
              </View>
            )}

            {mode === "signUp" && step === "form" && (
              <AuthInput
                placeholder="Full name"
                value={fullName}
                onChangeText={setFullName}
                autoComplete="name"
                textContentType="name"
                returnKeyType="next"
              />
            )}

            {(step === "form" || step === "resetCode") && (
              <AuthInput
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                editable={step !== "resetCode"}
                returnKeyType="next"
              />
            )}

            {isVerificationStep || step === "resetCode" ? (
              <AuthInput
                placeholder="Verification code"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                autoComplete="one-time-code"
                returnKeyType="done"
              />
            ) : null}

            {(step === "form" && mode !== "forgotPassword" || step === "newPassword") && (
              <AuthInput
                placeholder={step === "newPassword" ? "New password" : "Password"}
                value={password}
                onChangeText={setPassword}
                isPassword
                autoComplete={mode === "signUp" || step === "newPassword" ? "new-password" : "current-password"}
                textContentType={mode === "signUp" || step === "newPassword" ? "newPassword" : "password"}
                returnKeyType="done"
              />
            )}

            {mode === "signIn" && step === "form" && (
              <TouchableOpacity
                onPress={() => changeMode("forgotPassword")}
                style={styles.forgotButton}
              >
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            <AuthButton
              title={buttonTitle}
              onPress={submit}
              loading={isLoading}
              style={styles.submitButton}
            />

            {!!message && <Text style={styles.notice}>{message}</Text>}

            {mode === "signUp" && step === "form" && (
              <View nativeID="clerk-captcha" style={styles.captcha} />
            )}
          </View>

          {step === "form" && (
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {isReset
                  ? "Remember your password? "
                  : mode === "signUp"
                    ? "Already have an account? "
                    : "Don’t have an account? "}
              </Text>
              <TouchableOpacity
                onPress={() => changeMode(isReset || mode === "signUp" ? "signIn" : "signUp")}
              >
                <Text style={styles.footerLink}>
                  {isReset || mode === "signUp" ? "Sign in" : "Sign up"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {step !== "form" && (
            <TouchableOpacity
              onPress={() => {
                setStep("form");
                setMessage("");
                setCode("");
              }}
              style={styles.backButton}
            >
              <Text style={styles.footerLink}>Back</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
        <HomeIndicator />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    backgroundColor: "#FFFFFF",
  },
  page: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 12,
  },
  form: {
    width: "100%",
  },
  brand: {
    color: "#14202E",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -1.4,
    marginBottom: 28,
  },
  heading: {
    color: "#0F172A",
    fontSize: 21,
    fontWeight: "700",
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  subtitle: {
    color: "#52657C",
    fontSize: 14,
    marginBottom: 24,
    textAlign: "center",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },
  divider: {
    height: 1,
    flex: 1,
    backgroundColor: "#E2E8F0",
  },
  orText: {
    color: "#64748B",
    fontSize: 12,
    marginHorizontal: 14,
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -2,
    marginBottom: 20,
    paddingVertical: 3,
  },
  forgotText: {
    color: "#3B82F6",
    fontSize: 12,
    fontWeight: "500",
  },
  submitButton: {
    marginTop: 2,
  },
  notice: {
    color: "#52657C",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 12,
  },
  captcha: {
    height: 0,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },
  footerText: {
    color: "#7890AA",
    fontSize: 12,
  },
  footerLink: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "600",
  },
  backButton: {
    alignItems: "center",
    padding: 16,
  },
});
