import { Input } from "@heroui/react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setPrimaryColor } from "@/store/settingsSlice";
import { applyPrimaryColor } from "@/app/theme";
export default function PrimaryColorPicker(){
  const d = useAppDispatch();
  const color = useAppSelector(s=>s.settings.primaryColor);
  return (
    <div className="flex items-center gap-3">
      <Input type="color" label="Primary" value={color} onValueChange={(v)=>{ d(setPrimaryColor(v)); applyPrimaryColor(v); }} />
    </div>
  );
}
