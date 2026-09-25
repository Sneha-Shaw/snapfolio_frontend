import { useRef, useState, type DragEvent } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { projectService } from '@/services/project.service';
import { cn } from '@/utils/cn';

interface UploadedImage {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
}

interface ImageUploaderProps {
  label?: string;
  hint?: string;
  value?: string | null;
  onUploaded: (image: UploadedImage) => void;
  onRemove?: () => void;
  className?: string;
}

export function ImageUploader({ label, hint, value, onUploaded, onRemove, className }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setIsUploading(true);
    try {
      const result = await projectService.uploadImage(file);
      onUploaded(result);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void upload(file);
  };

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && <span className="block text-sm font-medium text-[var(--color-text)]">{label}</span>}
      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed transition-colors',
          isDragging
            ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]'
            : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-hover)]'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
            e.target.value = '';
          }}
        />

        {isUploading ? (
          <Loader2 className="size-6 animate-spin text-[var(--color-text-faint)]" />
        ) : value ? (
          <>
            <img src={value} alt="" className="absolute inset-0 size-full object-cover" />
            {onRemove && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-red-500/80"
              >
                <X className="size-4" />
              </button>
            )}
          </>
        ) : (
          <>
            <ImagePlus className="size-6 text-[var(--color-text-faint)]" />
            <span className="text-xs text-[var(--color-text-faint)]">Click or drag an image here</span>
          </>
        )}
      </div>
      {hint && <span className="block text-xs text-[var(--color-text-faint)]">{hint}</span>}
    </div>
  );
}
