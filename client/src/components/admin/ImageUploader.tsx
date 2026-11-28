import { useRef, useState, type DragEvent } from 'react';
import { ImagePlus, Loader2, UserRound, X } from 'lucide-react';
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
  /** `avatar`: a round photo with Upload/Remove buttons, for profile pictures. Default: a wide drop zone. */
  variant?: 'banner' | 'avatar';
}

export function ImageUploader({ label, hint, value, onUploaded, onRemove, className, variant = 'banner' }: ImageUploaderProps) {
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

  const fileInput = (
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
  );

  if (variant === 'avatar') {
    const btn =
      'rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-elevated-2)] disabled:opacity-50';
    return (
      <div className={cn('flex items-center gap-4', className)}>
        {fileInput}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          aria-label={value ? 'Change photo' : 'Upload photo'}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e as unknown as DragEvent<HTMLDivElement>)}
          className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated-2)] text-[var(--color-text-faint)]"
        >
          {value ? <img src={value} alt="" className="absolute inset-0 size-full object-cover" /> : <UserRound className="size-8" />}
          {isUploading && (
            <span className="absolute inset-0 grid place-items-center bg-black/50">
              <Loader2 className="size-5 animate-spin text-white" />
            </span>
          )}
        </button>
        <div className="space-y-1.5">
          {label && <span className="block text-sm font-medium text-[var(--color-text)]">{label}</span>}
          <div className="flex gap-2">
            <button type="button" className={btn} onClick={() => inputRef.current?.click()} disabled={isUploading}>
              {value ? 'Change' : 'Upload'}
            </button>
            {value && onRemove && (
              <button type="button" className={cn(btn, 'hover:text-red-400')} onClick={onRemove} disabled={isUploading}>
                Remove
              </button>
            )}
          </div>
          {hint && <span className="block text-xs text-[var(--color-text-faint)]">{hint}</span>}
        </div>
      </div>
    );
  }

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
        {fileInput}

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
