export const CONTRACT_IDS = {
  downstreamHarnessManifest: 'downstream-harness-manifest'
};

function fail(contractId, message) {
  throw new Error(`[${contractId}] ${message}`);
}

function asObject(value, contractId, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail(contractId, `${label} must be an object.`);
  }
  return value;
}

function asString(value, contractId, label, { allowEmpty = false } = {}) {
  if (typeof value !== 'string') {
    fail(contractId, `${label} must be a string.`);
  }
  if (!allowEmpty && value.trim().length === 0) {
    fail(contractId, `${label} must not be empty.`);
  }
  return value;
}

function asInteger(value, contractId, label, { minimum = null } = {}) {
  if (!Number.isInteger(value)) {
    fail(contractId, `${label} must be an integer.`);
  }
  if (minimum != null && value < minimum) {
    fail(contractId, `${label} must be >= ${minimum}.`);
  }
  return value;
}

function ensureSchemaVersion(contractId, payload) {
  const version = payload?.schemaVersion;
  if (!Number.isInteger(version)) {
    fail(contractId, 'schemaVersion must be an integer.');
  }
  if (version !== 1) {
    fail(contractId, `Unsupported schemaVersion '${version}'.`);
  }
}

function validateDownstreamHarnessManifest(payload) {
  const contractId = CONTRACT_IDS.downstreamHarnessManifest;
  const source = asObject(payload, contractId, 'payload');
  ensureSchemaVersion(contractId, source);
  asString(source.ownershipMode, contractId, 'ownershipMode');
  asString(source.sourceManifest, contractId, 'sourceManifest');
  asString(source.sourceManifestSha256, contractId, 'sourceManifestSha256');
  if (source.sourceRevision != null) {
    asString(source.sourceRevision, contractId, 'sourceRevision', { allowEmpty: true });
  }
  asString(source.installedAt, contractId, 'installedAt');
  if (!Array.isArray(source.managedFiles)) {
    fail(contractId, 'managedFiles must be an array.');
  }
  for (const [index, entry] of source.managedFiles.entries()) {
    const item = asObject(entry, contractId, `managedFiles[${index}]`);
    asString(item.sourcePath, contractId, `managedFiles[${index}].sourcePath`);
    asString(item.targetPath, contractId, `managedFiles[${index}].targetPath`);
    asString(item.sha256, contractId, `managedFiles[${index}].sha256`);
    asInteger(item.size, contractId, `managedFiles[${index}].size`, { minimum: 0 });
  }
  return source;
}

const validators = {
  [CONTRACT_IDS.downstreamHarnessManifest]: validateDownstreamHarnessManifest
};

export function parseContractPayload(contractId, payload) {
  const validator = validators[contractId];
  if (!validator) {
    fail(contractId, 'Unknown contract id.');
  }
  return validator(payload);
}

export function prepareContractPayload(contractId, payload) {
  if (contractId !== CONTRACT_IDS.downstreamHarnessManifest) {
    fail(contractId, 'Unknown contract id.');
  }
  return parseContractPayload(contractId, {
    schemaVersion: 1,
    ...payload
  });
}
