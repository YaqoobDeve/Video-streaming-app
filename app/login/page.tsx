"use client"
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Added error state for the UI
    const [loading, setLoading] = useState(false); // Added loading feedback
    
    const router = useRouter(); // Fixed: Added parentheses to invoke the hook

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(""); 
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false, // Prevents full page reload
            });

            if (result?.error) {
                // Display the error in the UI instead of just the console
                setError("Invalid email or password"); 
            } else {
                router.push("/");
                router.refresh(); // Good practice in App Router to update server components (like navbars)
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
                <div className="card-body p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-extrabold tracking-tight text-neutral">Welcome Back</h2>
                        <p className="text-sm text-base-content/60 mt-2">Log in to your account</p>
                    </div>

                    {/* Error Box */}
                    {error && (
                        <div className="alert alert-error py-2 text-sm rounded-lg mb-4 flex gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold text-base-content/85">Email Address</span>
                            </label>
                            <input 
                                type="email" 
                                placeholder="name@example.com" 
                                className="input input-bordered w-full focus:input-neutral focus:outline-none" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold text-base-content/85">Password</span>
                            </label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                className="input input-bordered w-full focus:input-neutral focus:outline-none" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-neutral w-full mt-6 normal-case text-base tracking-wide"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="divider my-6 text-xs text-base-content/40">OR</div>

                    <p className="text-center text-sm text-base-content/70">
                        Don't have an account?{" "}
                        <button 
                            onClick={() => router.push("/register")} 
                            className="link link-hover link-neutral font-bold text-neutral"
                        >
                            Register
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;