export const addonRoot = 'Assets/ALBUSMACHINERY/SaccExtensions';

export const scripts = [
  ['AMSE_BallAIController/Script/AMSE_BallAIController.cs', 'ball-ai'],
  ['AMSE_RadarAltimeterController/Script/AMSE_RadarAltimeterController.cs', 'radar-altimeter'],
  ['AMSE_LoadGaugeController/Script/AMSE_LoadGaugeController.cs', 'load-gauge'],
  ['AMSE_RotorStall/Script/AMSE_RotorStall.cs', 'rotor-stall'],
  ['AMSE_HeliGroundCyclic/Script/AMSE_HeliGroundCyclic.cs', 'heli-ground-cyclic'],
  ['AMSE_EngineStartupRespawnReset/Script/AMSE_EngineStartupRespawnReset.cs', 'engine-startup-reset'],
  ['AMSE_SoundController/Script/AMSE_SoundController.cs', 'sound-controller'],
  ['AMSE_SightView/Script/AMSE_SightViewController.cs', 'sight-view'],
  ['AMSE_SightView/Script/DFUNC_AMSE_SightView.cs', 'sight-view'],
  ['AMSE_AnimatorParameterRelay/Script/AMSE_AnimatorParameterRelay.cs', 'animator-relay'],
].map(([path, article]) => ({ path: `${addonRoot}/${path}`, article }));

scripts.push({
  path: 'Assets/SaccFlightAndVehicles/Scripts/Other/SaccGaugeController.cs',
  article: 'flight-instruments',
});

export const assets = [
  'AMSE_BallAIController/BallAttitudeIndicator.prefab',
  'AMSE_RadarAltimeterController/RadarAltimeter.prefab',
  'AMSE_FlightInstruments_TypeA/FlightInstrumentsA.prefab',
  'AMSE_SightView/AMSE_SightView.prefab',
  'AMSE_FlightInstruments_TypeA/Animation/FlightInstrumentsA.controller',
  'AMSE_RadarAltimeterController/Animation/RadarAltimeter.controller',
  'AMSE_BallAIController/Animation/BallAI.controller',
  'AMSE_SightView/docs/NETWORKING_RULES.md',
  'Shared/LICENSE.txt',
].map((path) => `${addonRoot}/${path}`);

assets.push(
  'Assets/SaccFlightAndVehicles/Scripts/SaccEntity.cs',
  'Assets/SaccFlightAndVehicles/package.json',
  'Assets/ALBUSMACHINERY/LoadGauge/Animation/LoadGauge.controller',
  'ProjectSettings/ProjectVersion.txt',
  'Packages/vpm-manifest.json',
);

// This intentionally targets the simple field declarations used by these sources.
// It is an inventory aid, not a general C# parser.
export function inspectorFields(source) {
  const fields = [];
  let attributes = '';
  let inDebugSection = false;
  for (const originalLine of source.split(/\r?\n/)) {
    const line = originalLine.replace(/\/\/.*$/, '').trim();
    if (!line) continue;
    const header = line.match(/\[Header\("([^"]+)"\)\]/);
    if (header) inDebugSection = /debug/i.test(header[1]);
    const leadingAttributes = line.match(/^(?:\[[^\]]*\]\s*)+/)?.[0] ?? '';
    attributes += leadingAttributes;
    const declaration = line.slice(leadingAttributes.length).trim();
    if (!declaration) continue;
    const field = declaration.match(/^(?:(public|private)\s+)?([\w.]+(?:\[\])?)\s+(\w+)\s*(?:=\s*(.*?))?;$/);
    if (field && !inDebugSection &&
        (field[1] === 'public' || /SerializeField/.test(attributes)) &&
        !/NonSerialized|UdonSynced/.test(attributes)) {
      fields.push({ name: field[3], type: field[2], codeDefault: field[4] ?? null });
    }
    attributes = '';
  }
  return fields;
}
