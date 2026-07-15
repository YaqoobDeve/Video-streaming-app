"use client" 

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

interface FileUploadProps {
    onSuccess: (res: any) => void;
    onProgress?: (progress: number) => void;
    fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType = "image" }: FileUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0); // Track progress state locally for UI visual feedback
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File) => {
        // Validation for Video
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please upload a valid video file");
                return false;
            }
        } 
        // Validation for Image
        else {
            if (!file.type.startsWith("image/")) {
                setError("Please upload a valid image file");
                return false;
            }
        }

        // File Size Limits: Max 100MB for video, 10MB for image
        const maxSize = fileType === "video" ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
            setError(`File size must be less than ${fileType === "video" ? "100MB" : "10MB"}`);
            return false;
        }

        return true;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setError(null); // Clear previous errors
        setProgress(0); // Reset progress

        if (!file) return;
        if (!validateFile(file)) return;

        setUploading(true);
        try {
            const authRes = await fetch("/api/auth/imagekit-auth");
            if (!authRes.ok) throw new Error("Failed to fetch imagekit auth options");
            const auth = await authRes.json();

            const res = await upload({
                file,
                fileName: file.name,
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                signature: auth.signature,
                expire: auth.expire,
                token: auth.token,
                onProgress: (event) => {
                    if (event.lengthComputable) {
                        const percent = (event.loaded / event.total) * 100;
                        const roundedPercent = Math.round(percent);
                        setProgress(roundedPercent);
                        if (onProgress) onProgress(roundedPercent);
                    }
                }
            });
            onSuccess(res);
        } catch (err: any) {
            console.error("Upload failed", err);
            setError(err.message || "Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full space-y-4">
            {/* Native Hidden File Input */}
            <input 
                type="file"
                ref={fileInputRef}
                accept={fileType === "video" ? "video/*" : "image/*"}
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Interactive Upload Card Area */}
            <div 
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3
                    ${uploading ? "border-neutral/30 bg-base-100 cursor-not-allowed" : "border-neutral/30 hover:border-neutral bg-base-100 hover:bg-base-200"}`}
            >
                {/* Visual Icon */}
                <div className="p-3 bg-neutral/10 text-neutral rounded-full">
                    {fileType === "video" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375 0 1 1-.75 0 .375 0 0 1 .75 0Z" />
                        </svg>
                    )}
                </div>

                {/* Status Messages */}
                <div>
                    <p className="font-semibold text-neutral">
                        {uploading ? "Uploading file..." : `Click to upload ${fileType}`}
                    </p>
                    <p className="text-xs text-base-content/60 mt-1">
                        {fileType === "video" ? "Max size: 100MB" : "Max size: 10MB"}
                    </p>
                </div>
            </div>

            {/* Error Message Box */}
            {error && (
                <div className="alert alert-error text-sm py-2 px-3 rounded-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{error}</span>
                </div>
            )}

            {/* Upload Progress Bar */}
            {uploading && (
                <div className="w-full space-y-2">
                    <progress className="progress progress-neutral w-full" value={progress} max="100"></progress>
                    <div className="flex justify-between text-xs text-base-content/60 px-1">
                        <span>Uploading...</span>
                        <span>{progress}%</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUpload;