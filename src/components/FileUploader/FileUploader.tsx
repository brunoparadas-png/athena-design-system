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
import styles from './FileUploader.module.css';

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
}

/**
 * One uploaded/uploading file: a forest icon pill, the name + size, a progress
 * bar with percent, and a remove button. At progress ≥ 1 the bar reads as the
 * success (completed) state. Mirrors the Figma File Uploader `isEmpty=false` row.
 */
export function FileRow({ file, onRemove, icon = 'file', removeLabel }: FileRowProps) {
  const pct = Math.round(Math.min(1, Math.max(0, file.progress ?? 1)) * 100);
  const isComplete = pct >= 100;
  return (
    <div className={styles.row}>
      <span className={styles.fileIcon} aria-hidden="true">
        <Icon name={icon} size={20} />
      </span>
      <div className={styles.rowContent}>
        <div className={styles.rowText}>
          <span className={styles.fileName}>{file.name}</span>
          {file.size != null && <span className={styles.fileSize}>{file.size}</span>}
        </div>
        <div className={styles.progressRow}>
          <ProgressBar
            value={(file.progress ?? 1)}
            appearance={isComplete ? 'success' : 'default'}
            label={`${file.name} upload`}
          />
          <span className={styles.percent}>{pct}%</span>
        </div>
      </div>
      {onRemove && (
        <button
          type="button"
          className={styles.remove}
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
  /** Disable the dropzone. */
  isDisabled?: boolean;
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
  isDisabled = false,
  fileIcon = 'file',
}: FileUploaderProps) {
  const inputId = useId();
  const labelId = `${inputId}-label`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const openPicker = () => {
    if (!isDisabled) inputRef.current?.click();
  };

  const emit = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    onFilesAdded?.(Array.from(list));
  };

  const onDragOver = (e: DragEvent) => {
    if (isDisabled) return;
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: DragEvent) => {
    // Ignore leaves into child elements.
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };
  const onDrop = (e: DragEvent) => {
    if (isDisabled) return;
    e.preventDefault();
    setIsDragging(false);
    emit(e.dataTransfer.files);
  };

  const zoneClass = [styles.dropzone, isDragging ? styles.dragging : '', isDisabled ? styles.disabled : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.root}>
      {label != null && (
        <span id={labelId} className={styles.label}>
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
        aria-disabled={isDisabled || undefined}
      >
        <span className={styles.placeholderIcon} aria-hidden="true">
          <Icon name={icon} size={48} />
        </span>
        <Button
          appearance="neutral"
          isDisabled={isDisabled}
          onClick={(e) => {
            e.stopPropagation();
            openPicker();
          }}
        >
          {buttonLabel}
        </Button>
        {message != null && <span className={styles.message}>{message}</span>}
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          className={styles.input}
          accept={accept}
          multiple={multiple}
          disabled={isDisabled}
          aria-labelledby={label != null ? labelId : undefined}
          onChange={(e) => {
            emit(e.target.files);
            // allow re-selecting the same file
            e.target.value = '';
          }}
        />
      </div>
      {files.length > 0 && (
        <ul className={styles.list}>
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
