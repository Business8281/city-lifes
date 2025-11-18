-- Clean up existing data before adding constraints

-- Fix phone numbers with country codes (remove +91 prefix for Indian numbers)
UPDATE profiles 
SET phone = REGEXP_REPLACE(phone, '^\+91', '')
WHERE phone ~ '^\+91[0-9]{10}$';

-- Add database-level validation constraints to prevent bypassing client-side validation

-- Messages table: enforce content length limits
ALTER TABLE messages 
ADD CONSTRAINT message_content_length 
CHECK (char_length(content) > 0 AND char_length(content) <= 2000);

-- Properties table: enforce title and description limits
ALTER TABLE properties
ADD CONSTRAINT property_title_length
CHECK (char_length(title) >= 5 AND char_length(title) <= 200);

ALTER TABLE properties
ADD CONSTRAINT property_description_length
CHECK (description IS NULL OR char_length(description) <= 5000);

ALTER TABLE properties
ADD CONSTRAINT property_price_positive
CHECK (price >= 0);

ALTER TABLE properties
ADD CONSTRAINT property_pin_code_format
CHECK (pin_code ~ '^[0-9]{6}$');

-- Profiles table: enforce name and phone validation (relaxed to allow various formats)
ALTER TABLE profiles
ADD CONSTRAINT profile_name_length
CHECK (full_name IS NULL OR (char_length(full_name) >= 1 AND char_length(full_name) <= 100));

ALTER TABLE profiles
ADD CONSTRAINT profile_phone_length
CHECK (phone IS NULL OR (char_length(phone) >= 10 AND char_length(phone) <= 15));

ALTER TABLE profiles
ADD CONSTRAINT profile_email_format
CHECK (email ~ '^[^@]+@[^@]+\.[^@]+$');

-- Ad campaigns table: enforce title and budget validation
ALTER TABLE ad_campaigns
ADD CONSTRAINT campaign_title_length
CHECK (char_length(title) >= 3 AND char_length(title) <= 100);

ALTER TABLE ad_campaigns
ADD CONSTRAINT campaign_budget_positive
CHECK (budget >= 0);

ALTER TABLE ad_campaigns
ADD CONSTRAINT campaign_spent_positive
CHECK (spent >= 0);

ALTER TABLE ad_campaigns
ADD CONSTRAINT campaign_dates_valid
CHECK (end_date > start_date);

-- Inquiries table: enforce message length
ALTER TABLE inquiries
ADD CONSTRAINT inquiry_message_length
CHECK (char_length(message) > 0 AND char_length(message) <= 2000);

-- Reviews table: enforce rating range and text length
ALTER TABLE reviews
ADD CONSTRAINT review_rating_range
CHECK (rating >= 1 AND rating <= 5);

ALTER TABLE reviews
ADD CONSTRAINT review_text_length
CHECK (review_text IS NULL OR char_length(review_text) <= 1000);

-- User reviews table: enforce rating range and text length
ALTER TABLE user_reviews
ADD CONSTRAINT user_review_rating_range
CHECK (rating >= 1 AND rating <= 5);

ALTER TABLE user_reviews
ADD CONSTRAINT user_review_text_length
CHECK (review_text IS NULL OR char_length(review_text) <= 1000);

-- Support tickets table: enforce subject and description limits
ALTER TABLE support_tickets
ADD CONSTRAINT support_subject_length
CHECK (subject IS NULL OR (char_length(subject) >= 3 AND char_length(subject) <= 200));

ALTER TABLE support_tickets
ADD CONSTRAINT support_description_length
CHECK (char_length(description) >= 10 AND char_length(description) <= 5000);