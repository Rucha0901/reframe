"use client";

import { EditRecipe } from "@/lib/types";
import { SlidersHorizontal, Info as InfoIcon, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  estimateExportSize,
  formatEstimatedSize,
} from "@/lib/exportEstimate";

interface Props {
  recipe: EditRecipe;
  duration: number;
  onChange: (patch: Partial<EditRecipe>) => void;
}

export default function ExportSettings({
  recipe,
  duration,
  onChange,
}: Props) {
  const label =
    recipe.quality <= 21
      ? "High"
      : recipe.quality <= 25
      ? "Balanced"
      : "Small file";

  const isGif = recipe.format === "gif";

  const estimatedSize =
    formatEstimatedSize(
      estimateExportSize(
        recipe,
        duration
      )
    );

  return (
    <div className="space-y-5">
      {/* Quality slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="quality-control"
            className="text-[10px] font-heading font-semibold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5"
          >
            <SlidersHorizontal size={10} />
            Quality

            <span
              className="cursor-help"
              title="CRF (Constant Rate Factor): lower = higher quality, larger file. 18 = best quality, 30 = smallest file."
            >
              <InfoIcon size={14} />
            </span>
          </label>

          <span className="text-sm font-heading font-bold text-film-600">
            {label}

            <span className="font-normal text-xs text-[var(--muted)] ml-1">
              CRF {recipe.quality}
            </span>
          </span>
        </div>

        <input
          id="quality-control"
          type="range"
          min={18}
          max={30}
          step={1}
          value={48 - recipe.quality}
          onChange={(e) =>
            onChange({
              quality: 48 - Number(e.target.value),
            })
          }
          aria-describedby="quality-description"
          aria-label="Video export quality (CRF)"
          aria-valuetext={`${label} quality, CRF value ${recipe.quality}`}
          className="w-full accent-film-600 cursor-pointer"
        />

        <div id="quality-description" className="mt-1 space-y-3">
          <div className="flex justify-between">
            <span className="text-[10px] text-[var(--muted)]">
              Smallest file
            </span>

            <span className="text-[10px] text-[var(--muted)]">
              Best quality
            </span>
          </div>

          <p className="text-xs text-[var(--muted)]">
            Estimated size:{" "}
            <span className="font-semibold text-[var(--text)]">
              {estimatedSize}
            </span>
          </p>

          {isGif && (
            <p className="text-xs text-[var(--warning)] font-medium">
              ⚠ GIF files can be very large. Keep clips under 10 s for best results.
            </p>
          )}
        </div>
      </div>

      {/* Sound on completion toggle */}
      {!isGif && (
        <div className="flex items-center justify-between py-2 border-t border-[var(--border)]">
          <label
            htmlFor="sound-on-completion"
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <Volume2
              size={13}
              className={cn(
                "transition-colors",
                recipe.soundOnCompletion ? "text-film-500" : "text-[var(--muted)]"
              )}
            />
            <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-[var(--muted)]">
              Sound on completion
            </span>
          </label>
          <button
            id="sound-on-completion"
            type="button"
            role="switch"
            aria-checked={recipe.soundOnCompletion}
            aria-label="Play a chime when export finishes"
            onClick={() => onChange({ soundOnCompletion: !recipe.soundOnCompletion })}
            className={cn(
              "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent",
              "transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-film-400 focus:ring-offset-1",
              recipe.soundOnCompletion ? "bg-film-600" : "bg-[var(--border)]"
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm",
                "transform transition duration-200 ease-in-out",
                recipe.soundOnCompletion ? "translate-x-4" : "translate-x-0"
              )}
            />
          </button>
        </div>
      )}

      {/* Stabilization */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor="stabilization-toggle"
            className="text-sm font-heading font-semibold uppercase tracking-wider text-[var(--muted)] flex items-center gap-2"
          >
            <SlidersHorizontal size={10} />
            Stabilization
          </label>

          <span className="flex text-sm font-heading font-bold text-film-600">
            <input
              id="stabilization-toggle"
              type="checkbox"
              checked={recipe.stabilization}
              onChange={(e) =>
                onChange({
                  stabilization: e.target.checked,
                })
              }
              aria-label="Enable video stabilization"
              className="w-full accent-film-600 cursor-pointer"
            />
          </span>
        </div>

        <p className="text-xs text-[var(--muted)] mb-1">
          Reduce camera shake
        </p>

        <div className="flex justify-end">
          <span
            className={cn(
              "text-xs",
              recipe.stabilization
                ? "text-[var(--error)] font-medium"
                : "text-[var(--muted)]"
            )}
          >
            Note: significantly increases processing time.
          </span>
        </div>
      </div>

      {/* Denoise */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor="denoise-toggle"
            className="text-sm font-heading font-semibold uppercase tracking-wider text-[var(--muted)] flex items-center gap-2"
          >
            <SlidersHorizontal size={10} />
            Reduce noise

            <span
              className="cursor-help"
              title="Reduces video noise. May slow down export slightly."
            >
              <InfoIcon size={14} />
            </span>
          </label>

          <span className="flex text-sm font-heading font-bold text-film-600">
            <input
              id="denoise-toggle"
              type="checkbox"
              checked={recipe.denoise}
              onChange={(e) =>
                onChange({
                  denoise: e.target.checked,
                })
              }
              aria-label="Enable noise reduction"
              aria-checked={recipe.denoise}
              className="w-full accent-film-600 cursor-pointer"
            />
          </span>
        </div>

        <p className="text-xs text-[var(--muted)] mb-1">
          Reduce low-light video grain
        </p>

        <div className="flex justify-end">
          <span
            className={cn(
              "text-xs",
              recipe.denoise
                ? "text-red-700 font-medium"
                : "text-[var(--muted)]"
            )}
          >
            May slightly increase export time.
          </span>
        </div>
      </div>
    </div>
  );
}
