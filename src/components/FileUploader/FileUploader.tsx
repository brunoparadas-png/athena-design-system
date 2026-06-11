import {
  useId,
  useRef,
  useState,
  type DragEvent,
  type ReactNode,
} from 'react';
import { Button } from '../Button';
import { Icon, type IconName } from '../Icon';
import { ProgressBar } from '../ProgressBar';

/** A file being uploaded or already uploaded, rendered as a FileRow. */
export interface UploadFile {
  /** Stable id; used as the React key and passed to onRemove. */
  id: string;
  /** File name shown in bold. */
  name: string;
  /** Human-readable size, e.g. "200 KB". */
  size?: string;
  /** Upload completion 0–1. Omit (or 1) for an already-uploaded file. */
  progress?: number;
}

export interface FileRowProps {
  file: UploadFile;
  /** Called with the file id when the remove (trash) button is pressed. */
  onRemove?: (id: string) => void;
  /** Icon inside the leading pill. Defaults to `file`. */
  icon?: IconName;
  /** Accessible label for the remove button. Defaults to `Remove {name}`. */
  removeLabel?: string;
  /**
   * Whether this row is in the selected/highlighted state. Mirrors the Figma
   * `isSelected` top-level variant on the FileUploader component set.
   */
  isSelected?: boolean;
  /**
   * Explicitly force the completed state. When omitted, completion is derived
   * from `file.progress >= 1`. Mirrors the Figma `isCompleted` top-level variant.
   */
  isCompleted?: boolean;
}

/**
 * One uploaded/uploading file: a forest icon pill, the name + size, a progress
 * bar with percent, and a remove button. At progress ≥ 1 the bar reads as the
 * success (completed) state. Mirrors the Figma File Uploader `isEmpty=false` row.
 */
export function FileRow({ file, onRemove, icon = 'file', removeLabel, isSelected = false, isCompleted }: FileRowProps) {
  const pct = Math.round(Math.min(1, Math.max(0, file.progress ?? 1)) * 100);
  const isComplete = isCompleted ?? pct >= 100;
  return (
    <div className={`flex items-start gap-2 box-border w-full px-4 py-3 border ${isSelected ? 'bg-forest-50 border-forest-500' : 'bg-white border-neutral-300'}`}>
      <span
        className="inline-flex items-center justify-center flex-shrink-0 p-1 rounded-full bg-forest-50 text-forest-700"
        aria-hidden="true"
      >
        <Icon name={icon} size={20} />
      </span>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex flex-col">
          <span className="text-sm leading-5 font-semibold text-neutral-800 break-words">{file.name}</span>
          {file.size != null && (
            <span className="text-xs leading-4 text-neutral-600">{file.size}</span>
          )}
        </div>
        <div className="flex items-center gap-1 w-full">
          <div className="flex-1 min-w-0">
            <ProgressBar
              value={(file.progress ?? 1)}
              appearance={isComplete ? 'success' : 'default'}
              label={`${file.name} upload`}
            />
          </div>
          <span className="flex-shrink-0 text-xs leading-4 font-semibold text-forest-500">{pct}%</span>
        </div>
      </div>
      {onRemove && (
        <button
          type="button"
          className="appearance-none m-0 border-0 bg-transparent cursor-pointer flex-shrink-0 inline-flex items-center justify-center p-2 rounded-none text-neutral-600 transition-[background-color,color] duration-[120ms] ease-[ease] hover:bg-forest-100 hover:text-forest-700 active:bg-forest-200 focus-visible:outline-2 focus-visible:outline-forest-700 focus-visible:-outline-offset-2 motion-reduce:transition-none"
          aria-label={removeLabel ?? `Remove ${file.name}`}
          onClick={() => onRemove(file.id)}
        >
          <Icon name="trash" size={16} />
        </button>
      )}
    </div>
  );
}

export interface FileUploaderProps {
  /** Field label shown above the dropzone. */
  label?: ReactNode;
  /** Text inside the dropzone button. (Figma: "Add image") */
  buttonLabel?: ReactNode;
  /** Hint shown under the button (e.g. accepted types / max size). (Figma: "Subheader message") */
  message?: ReactNode;
  /** Placeholder icon in the dropzone. `image` | `cloud-upload` | `file`. Defaults to `image`. */
  icon?: IconName;
  /** Files to list below the dropzone (controlled). */
  files?: UploadFile[];
  /** Native `accept` filter forwarded to the input. */
  accept?: string;
  /** Allow selecting multiple files. */
  multiple?: boolean;
  /** Fires with the chosen/dropped files. */
  onFilesAdded?: (files: File[]) => void;
  /** Fires with a file id when its remove button is pressed. */
  onRemove?: (id: string) => void;
  /** Icon for each file row's leading pill. Defaults to `file`. */
  fileIcon?: IconName;
}

/**
 * Mirrors the Figma "❖ File Uploader" (node 703:13044). A dashed dropzone that
 * opens the file picker on click and accepts drag-and-drop, plus a list of
 * FileRows for the chosen files. Drag-over tints the zone forest. Reuses Button,
 * Icon, and ProgressBar.
 */
export function FileUploader({
  label,
  buttonLabel = 'Upload file',
  message,
  icon = 'image',
  files = [],
  accept,
  multiple = false,
  onFilesAdded,
  onRemove,
  fileIcon = 'file',
}: FileUploaderProps) {
  const inputId = useId();
  const labelId = `${inputId}-label`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const openPicker = () => {
    inputRef.current?.click();
  };

  const emit = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    onFilesAdded?.(Array.from(list));
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: DragEvent) => {
    // Ignore leaves into child elements.
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    emit(e.dataTransfer.files);
  };

  const zoneClass = `box-border flex flex-col items-center justify-center gap-1 w-full px-2 py-4 border border-dashed transition-[background-color,border-color] duration-[120ms] ease-[ease] motion-reduce:transition-none focus-within:outline-none ${
    isDragging
      ? 'cursor-pointer bg-forest-50 border-forest-500 border-solid'
      : 'cursor-pointer bg-white border-neutral-300 hover:bg-forest-50 hover:border-forest-500'
  }`;

  return (
    <div className="flex flex-col gap-1 font-[var(--font-main)]">
      {label != null && (
        <span id={labelId} className="text-xs leading-4 font-semibold text-neutral-600">
          {label}
        </span>
      )}
      {/* The zone is clickable but not a <button> (it contains a Button); the inner
          Button and keyboard users trigger the input directly. */}
      <div
        className={zoneClass}
        onClick={openPicker}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <span
          className="inline-flex text-neutral-800"
          aria-hidden="true"
        >
          <Icon name={icon} size={48} />
        </span>
        <Button
          appearance="neutral"
          onClick={(e) => {
            e.stopPropagation();
            openPicker();
          }}
        >
          {buttonLabel}
        </Button>
        {message != null && (
          <span className="text-xs leading-4 text-neutral-500 text-center">{message}</span>
        )}
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          className="absolute w-px h-px p-0 -m-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0"
          accept={accept}
          multiple={multiple}
          aria-labelledby={label != null ? labelId : undefined}
          onChange={(e) => {
            emit(e.target.files);
            // allow re-selecting the same file
            e.target.value = '';
          }}
        />
      </div>
      {files.length > 0 && (
        <ul className="list-none m-0 p-0 flex flex-col gap-2">
          {files.map((file) => (
            <li key={file.id}>
              <FileRow file={file} onRemove={onRemove} icon={fileIcon} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
