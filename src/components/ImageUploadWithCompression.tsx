import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, AlertCircle } from 'lucide-react';
import { compressImage, validateImage } from '@/utils/imageOptimization';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ImageUploadWithCompressionProps {
  onUpload: (files: File[]) => Promise<void>;
  maxFiles?: number;
  className?: string;
  variant?: 'default' | 'minimal';
}

export const ImageUploadWithCompression = ({
  onUpload,
  maxFiles = 10,
  className,
  variant = 'default',
}: ImageUploadWithCompressionProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    if (files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed`);
      return;
    }

    setUploading(true);
    setProgress(0);
    const compressedFiles: File[] = [];
    const newPreviews: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate
        const validation = validateImage(file);
        if (!validation.valid) {
          toast.error(validation.error || 'Invalid image');
          continue;
        }

        // Show warning for large files
        if (file.size > 2 * 1024 * 1024) {
          toast.info(`Compressing ${file.name}...`);
        }

        // Compress
        const compressed = await compressImage(file, 1600, 0.8);
        compressedFiles.push(compressed.file);
        newPreviews.push(compressed.dataUrl);

        setProgress(((i + 1) / files.length) * 100);
      }

      setPreviews(newPreviews);
      await onUpload(compressedFiles);
      toast.success(`${compressedFiles.length} images compressed and uploaded!`);

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  if (variant === 'minimal') {
    return (
      <div className={className}>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Compressing...' : 'Upload Images'}
        </Button>
        {uploading && <Progress value={progress} className="mt-2" />}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        <div className="flex flex-col items-center gap-2">
          <Upload className="w-12 h-12 text-muted-foreground" />
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Compressing...' : 'Choose Images'}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Max {maxFiles} images • JPG, PNG, WebP • Max 10MB each
            </p>
          </div>
          {uploading && (
            <div className="w-full max-w-xs">
              <Progress value={progress} />
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(progress)}% complete
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image size warning */}
      <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
        <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Auto-compression enabled</p>
          <p>Images will be automatically compressed to WebP format and resized to optimal dimensions for fast loading.</p>
        </div>
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((preview, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removePreview(index)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
