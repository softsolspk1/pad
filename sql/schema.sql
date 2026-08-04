CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,

  full_name TEXT NOT NULL,
  father_husband_name TEXT NOT NULL,
  designation TEXT NOT NULL,
  gender TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  cnic_number TEXT NOT NULL,

  member_residence TEXT NOT NULL,
  country TEXT NOT NULL,
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  home_address TEXT NOT NULL,

  institute_name TEXT NOT NULL,
  pmdc_number TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  institute_address TEXT NOT NULL,

  photo_url TEXT NOT NULL,
  mbbs_certificate_url TEXT NOT NULL,
  cnic_copy_url TEXT NOT NULL,
  degree_url TEXT NOT NULL,

  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (email),
  UNIQUE (cnic_number),
  UNIQUE (pmdc_number)
);
