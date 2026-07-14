"use client"
import { useRouter } from 'next/navigation'; // Updated import to prevent App Router crash
import React, { useState } from 'react'

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(""); // Integrated clean error state
    const [loading, setLoading] = useState(false); // Added loading feedback
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                })
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }

            router.push("/login");
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
                <div className="card-body p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-extrabold tracking-tight text-neutral">Create Account</h2>
                        <p className="text-sm text-base-content/60 mt-2">Sign up to start streaming</p>
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

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-semibold text-base-content/85">Confirm Password</span>
                            </label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                className="input input-bordered w-full focus:input-neutral focus:outline-none" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required 
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-neutral w-full mt-4 normal-case text-base tracking-wide"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                "Register"
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="divider my-6 text-xs text-base-content/40">OR</div>

                    <p className="text-center text-sm text-base-content/70">
                        Already have an account?{" "}
                        <button 
                            onClick={() => router.push("/login")} 
                            className="link link-hover link-neutral font-bold text-neutral"
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage;