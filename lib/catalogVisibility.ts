const hiddenProductIds = new Set([
  "94ca3dcb-155e-4ee2-9fe3-4f0426ec86bb", // Apple Watch S10
  "1a34cc34-b26f-47f2-8f1c-f2df6dccd010", // Apple Watch Ultra 3 (base)
  "ed5a6664-791e-43e1-8d92-435aef76ffd6", // DSC RX100 VII (duplicate renamed from DSC RX 100)
  "f2d5f946-b877-4d26-98fc-9fc0d2354c79", // Apple Watch S11
  "69e27d8a-825f-40eb-bfe2-2dad04c1d0f6", // Panasonic HC-X2100 4K UHD 3G/SDI/HDMI Pro with 24X
  "2c88c4fc-8378-49df-be67-6f4017ba4ee8", // Canon EOS 4000D Kit 18-55 III / T100
  "6d20abf5-fc33-42ba-ae58-6a0e282ce3ee", // Canon EOS 5D Mark IV Body
  "845e855d-5903-4dec-b6a0-13bdd9d161b6", // Canon EOS R1 Body
  "3374fe5c-9155-4cf0-9b3f-79c1179d8542", // Canon EOS R10 Body
  "de6d0ef8-fbe8-49c7-8951-7081b71c724d", // Canon EOS R100 Kit 18-45 / 55-210
  "fb784a8a-e63c-4c2b-aeb7-6ae3284b9767", // Canon EOS R3 Body
  "466bc2f8-652f-4e00-b8c7-737452fa472d", // Canon EOS R5 Body
  "023eadfa-5d9c-441c-8b01-d63e3e477ab1", // Canon EOS R5 Kit 24-105 F/4
  "27dc772e-3fc3-4d47-9f0e-ac8501d4d048", // Canon EOS R50 Kit 18-45 / 55-210
  "5deb771a-ce8e-413c-989c-dff547888601", // Canon EOS R5 C Cinema
  "79d83d9b-9386-4979-8202-f9364816431c", // Canon EOS R6 Mark III Kit 24-105 F4-7.1 IS STM
  "38a5cfa2-687f-4d49-83d5-e8cc6f8bf5e0", // Canon EOS R6 Mark III Body
  "71574095-6908-4a27-874a-c22562a295b5", // Canon EOS R7 Kit 18-150
  "dbc75608-15c5-4959-9cd5-2c02014b84ff", // Canon EOS RP Body
  "137a085f-7705-481d-988e-9e26fb138f01", // Batería SmallRig LP-E6NH Kit 2 baterías + cargador
  "2dcf4d9f-9261-425e-8bb1-18c40aa0751b", // Mount Adapter Control Ring EF-EOS R
]);

export function isProductHidden(product: { id: string }) {
  return hiddenProductIds.has(product.id);
}
