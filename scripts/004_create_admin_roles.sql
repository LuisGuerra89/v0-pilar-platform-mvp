-- Add role column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create index for role queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles (role);

-- Update RLS policies for admin access
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins can view all pets"
  ON pets FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins can update bookings"
  ON bookings FOR UPDATE
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins can view all properties"
  ON properties FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins can insert properties"
  ON properties FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins can update properties"
  ON properties FOR UPDATE
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins can delete properties"
  ON properties FOR DELETE
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Set first user as admin (for demo purposes)
-- In production, you would manually set admin users
UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1);
