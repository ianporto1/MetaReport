import { useState } from 'react'
import './DateRangePicker.css'

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onDateChange: (start: string, end: string) => void
  compareStartDate?: string
  compareEndDate?: string
  onCompareChange?: (start: string, end: string) => void
  showCompare?: boolean
}

export function DateRangePicker({
  startDate,
  endDate,
  onDateChange,
  compareStartDate,
  compareEndDate,
  onCompareChange,
  showCompare = false,
}: DateRangePickerProps) {
  const [enableCompare, setEnableCompare] = useState(!!compareStartDate)

  return (
    <div className="date-range-picker">
      <div className="date-range-row">
        <label>
          Data Inicial
          <input
            type="date"
            value={startDate}
            onChange={(e) => onDateChange(e.target.value, endDate)}
          />
        </label>
        <label>
          Data Final
          <input
            type="date"
            value={endDate}
            onChange={(e) => onDateChange(startDate, e.target.value)}
          />
        </label>
      </div>

      {showCompare && (
        <div className="compare-section">
          <label className="compare-toggle">
            <input
              type="checkbox"
              checked={enableCompare}
              onChange={(e) => setEnableCompare(e.target.checked)}
            />
            Comparar com período anterior
          </label>

          {enableCompare && onCompareChange && (
            <div className="date-range-row">
              <label>
                Comparar de
                <input
                  type="date"
                  value={compareStartDate || ''}
                  onChange={(e) => onCompareChange(e.target.value, compareEndDate || '')}
                />
              </label>
              <label>
                Até
                <input
                  type="date"
                  value={compareEndDate || ''}
                  onChange={(e) => onCompareChange(compareStartDate || '', e.target.value)}
                />
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
