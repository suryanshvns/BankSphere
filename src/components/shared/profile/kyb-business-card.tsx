"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSubmitBusinessProfileMutation } from "@/hooks/use-platform-business";
import { getErrorMessage } from "@/services/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function KybBusinessCard() {
  const mutation = useSubmitBusinessProfileMutation();
  const [companyName, setCompanyName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [country, setCountry] = useState("US");

  return (
    <GlassCard>
      <p className="text-sm font-medium text-zinc-200 light:text-zinc-800">
        Business profile (KYB)
      </p>
      <p className="mt-1 text-xs text-zinc-500">POST /platform/business/profile</p>
      <div className="mt-4 space-y-3">
        <div>
          <Label htmlFor="kyb-co">Company name</Label>
          <Input
            id="kyb-co"
            className="mt-1.5"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="kyb-reg">Registration number</Label>
          <Input
            id="kyb-reg"
            className="mt-1.5"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="kyb-country">Country</Label>
          <Input
            id="kyb-country"
            className="mt-1.5"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="US"
          />
        </div>
        <Button
          type="button"
          disabled={
            mutation.isPending ||
            !companyName.trim() ||
            !registrationNumber.trim() ||
            !country.trim()
          }
          onClick={async () => {
            try {
              await mutation.mutateAsync({
                company_name: companyName.trim(),
                registration_number: registrationNumber.trim(),
                country: country.trim(),
              });
              toast.success("Business profile submitted");
            } catch (err) {
              toast.error(getErrorMessage(err));
            }
          }}
        >
          {mutation.isPending ? "Submitting…" : "Submit KYB"}
        </Button>
      </div>
    </GlassCard>
  );
}
