import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input, InputField } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { Mail, Search, ChevronDown } from "lucide-react"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-[#0e2c46] mb-4 pb-2 border-b border-[#d0d5dd]">{title}</h2>
      <div className="flex flex-wrap gap-3 items-start">{children}</div>
    </section>
  )
}

export function ComponentPlayground() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [checked, setChecked] = useState(false)
  const [switchOn, setSwitchOn] = useState(false)
  const [radio, setRadio] = useState("a")

  return (
    <div className="min-h-screen bg-[#f2f4f7] p-8">
      <h1 className="text-2xl font-semibold text-[#0e2c46] mb-2">Neustring Component Playground</h1>
      <p className="text-sm text-[#667085] mb-8">Phase 0 smoke test — verify all variants render correctly with Inter font and Neustring tokens.</p>

      {/* ── Buttons ─────────────────────────────────────────────────── */}
      <Section title="Button — all 8 variants × 3 sizes">
        {(["default","outline","ghost","secondary","secondary-outline","destructive","destructive-outline","neutral-ghost"] as const).map(v => (
          <div key={v} className="flex flex-col gap-2">
            <Button variant={v} size="sm">{v} sm</Button>
            <Button variant={v} size="default">{v} md</Button>
            <Button variant={v} size="lg">{v} lg</Button>
          </div>
        ))}
        <Button disabled>disabled</Button>
      </Section>

      {/* ── Badges ──────────────────────────────────────────────────── */}
      <Section title="Badge — 9 solid + 9 outline">
        {(["solid-brand-primary","solid-brand-secondary","solid-green","solid-yellow","solid-red","solid-blue","solid-gray","solid-white"] as const).map(v => (
          <Badge key={v} variant={v}>{v.replace("solid-","")}</Badge>
        ))}
        {(["outline-brand-primary","outline-brand-secondary","outline-green","outline-yellow","outline-red","outline-blue","outline-gray"] as const).map(v => (
          <Badge key={v} variant={v}>{v.replace("outline-","")}</Badge>
        ))}
      </Section>

      {/* ── Inputs ──────────────────────────────────────────────────── */}
      <Section title="Input — 4 sizes + states">
        <div className="flex flex-col gap-3 w-64">
          <Input size="sm" placeholder="Small input" />
          <Input size="md" placeholder="Medium input" />
          <Input size="default" placeholder="Large (default) input" />
          <Input size="xl" placeholder="XL input" />
          <Input size="default" placeholder="Focus me" />
          <Input size="default" placeholder="Error state" aria-invalid="true" />
          <Input size="default" placeholder="Disabled" disabled />
        </div>
        <div className="flex flex-col gap-3 w-64">
          <InputField leading={<Mail className="size-4" />} inputProps={{ placeholder: "With leading icon" }} />
          <InputField trailing={<Search className="size-4" />} inputProps={{ placeholder: "With trailing icon" }} />
          <InputField
            leading={<Mail className="size-4" />}
            trailing={<span className="text-xs">USD</span>}
            inputProps={{ placeholder: "Leading + trailing" }}
          />
          <InputField error inputProps={{ placeholder: "Error state" }} />
          <InputField size="sm" inputProps={{ placeholder: "Small compound" }} />
        </div>
      </Section>

      {/* ── Tabs ────────────────────────────────────────────────────── */}
      <Section title="Tabs — primary + secondary active color">
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">Operations</TabsTrigger>
            <TabsTrigger value="b">History</TabsTrigger>
            <TabsTrigger value="c" disabled>Disabled</TabsTrigger>
          </TabsList>
          <TabsContent value="a"><p className="text-sm text-[#667085] mt-2">Operations content</p></TabsContent>
          <TabsContent value="b"><p className="text-sm text-[#667085] mt-2">History content</p></TabsContent>
        </Tabs>
        <Tabs defaultValue="x">
          <TabsList>
            <TabsTrigger value="x" activeColor="secondary">All</TabsTrigger>
            <TabsTrigger value="y" activeColor="secondary">Critical</TabsTrigger>
            <TabsTrigger value="z" activeColor="secondary">Medium</TabsTrigger>
          </TabsList>
          <TabsContent value="x"><p className="text-sm text-[#667085] mt-2">Secondary active</p></TabsContent>
        </Tabs>
      </Section>

      {/* ── Switch ──────────────────────────────────────────────────── */}
      <Section title="Switch — 3 sizes + states">
        <div className="flex flex-col gap-3">
          {(["sm","default","lg"] as const).map(s => (
            <div key={s} className="flex items-center gap-3">
              <Switch size={s} checked={switchOn} onCheckedChange={setSwitchOn} />
              <span className="text-sm text-[#344054]">Switch {s} — {switchOn ? "on" : "off"}</span>
            </div>
          ))}
          <div className="flex items-center gap-3">
            <Switch disabled />
            <span className="text-sm text-[#98a2b3]">Disabled</span>
          </div>
        </div>
      </Section>

      {/* ── Checkbox ────────────────────────────────────────────────── */}
      <Section title="Checkbox">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Checkbox id="cb1" checked={checked} onCheckedChange={(v) => setChecked(!!v)} />
            <label htmlFor="cb1" className="text-sm text-[#344054]">{checked ? "Checked" : "Unchecked"}</label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb2" defaultChecked />
            <label htmlFor="cb2" className="text-sm text-[#344054]">Default checked</label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb3" disabled />
            <label htmlFor="cb3" className="text-sm text-[#98a2b3]">Disabled</label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb4" disabled defaultChecked />
            <label htmlFor="cb4" className="text-sm text-[#98a2b3]">Disabled checked</label>
          </div>
        </div>
      </Section>

      {/* ── Radio ───────────────────────────────────────────────────── */}
      <Section title="Radio Group">
        <RadioGroup value={radio} onValueChange={setRadio} className="gap-3">
          {["a","b","c"].map(v => (
            <div key={v} className="flex items-center gap-2">
              <RadioGroupItem value={v} id={`r${v}`} />
              <label htmlFor={`r${v}`} className="text-sm text-[#344054]">Option {v.toUpperCase()}</label>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <RadioGroupItem value="d" id="rd" disabled />
            <label htmlFor="rd" className="text-sm text-[#98a2b3]">Disabled</label>
          </div>
        </RadioGroup>
      </Section>

      {/* ── Dropdown ────────────────────────────────────────────────── */}
      <Section title="Dropdown Menu">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Open menu <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuItem>Profile <DropdownMenuShortcut>⌘P</DropdownMenuShortcut></DropdownMenuItem>
            <DropdownMenuItem>Settings <DropdownMenuShortcut>⌘S</DropdownMenuShortcut></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem disabled>Billing (disabled)</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[#f04438]">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>

      {/* ── Calendar ────────────────────────────────────────────────── */}
      <Section title="Calendar / Date Picker">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
        />
        <Calendar
          mode="range"
          selected={{ from: new Date(2026, 3, 10), to: new Date(2026, 3, 18) }}
        />
      </Section>
    </div>
  )
}
