-- Make email field optional for leads since users may not want to provide email
ALTER TABLE leads ALTER COLUMN email DROP NOT NULL;

-- Update existing placeholder emails to null for cleaner data
UPDATE leads SET email = NULL WHERE email LIKE 'noemail-%@citylifes.placeholder';