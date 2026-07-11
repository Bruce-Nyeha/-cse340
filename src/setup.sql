
INSERT INTO organization (name, description, contact_email, logo_filename) 
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png')

SELECT * FROM organization;

CREATE TABLE service_project (
  project_id SERIAL PRIMARY KEY,
  organization_id INT NOT NULL REFERENCES organization(organization_id),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,   
  date DATE NOT NULL
);

SELECT * FROM service_project; 

INSERT INTO service_project (organization_id, title, description, location, date)
VALUES
(1, 'Community Playground Build', 'Constructing a safe and modern playground for local families.', 'Oakridge Neighborhood Park', '2024-08-12'),
(1, 'Youth Carpentry Workshop', 'Teaching teens basic carpentry and tool safety.', 'BrightFuture Training Center', '2024-09-03'),
(1, 'Neighborhood Home Repair Day', 'Providing free minor repairs for low-income households.', 'Eastwood Community', '2024-09-18'),
(1, 'Community Center Renovation', 'Renovating the old community center to support youth programs.', 'Riverside Community Center', '2024-10-02'),
(1, 'Shelter Bunk Construction', 'Building new bunk frames for the local homeless shelter.', 'Hope Haven Shelter', '2024-08-27');

INSERT INTO service_project (organization_id, title, description, location, date)
VALUES
(2, 'Urban Garden Expansion', 'Expanding the community garden to increase fresh produce availability.', 'Maple Street Garden', '2024-08-15'),
(2, 'Composting Education Day', 'Teaching residents how to compost and reduce waste.', 'GreenHarvest Farm Hub', '2024-09-07'),
(2, 'Farm-to-Family Produce Drive', 'Harvesting and distributing fresh vegetables to local families.', 'GreenHarvest Fields', '2024-09-21'),
(2, 'Pollinator Habitat Planting', 'Planting flowers and shrubs to support bees and butterflies.', 'Lakeside Nature Reserve', '2024-10-04'),
(2, 'Sustainable Irrigation Workshop', 'Training volunteers on water-efficient irrigation systems.', 'Community Agriculture Center', '2024-08-30');

INSERT INTO service_project (organization_id, title, description, location, date)
VALUES
(3, 'Back-to-School Supply Fair', 'Providing backpacks and supplies to students in need.', 'UnityServe Hall', '2024-08-20'),
(3, 'Warm Meals Outreach', 'Serving hot meals to unhoused community members.', 'Downtown Outreach Plaza', '2024-09-10'),
(3, 'Senior Companion Day', 'Spending time with seniors through games and conversation.', 'Golden Years Senior Home', '2024-09-25'),
(3, 'Community Wellness Expo', 'Offering free health screenings and wellness resources.', 'City Civic Center', '2024-10-06'),

(3, 'Emergency Relief Kit Assembly', 'Assembling emergency kits for families affected by disasters.', 'UnityServe Warehouse', '2024-08-28');


-- 1. Create the base Category table
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- 2. Create the Many-to-Many Junction Table to link Projects and Categories
CREATE TABLE project_category (
    project_id INT REFERENCES service_project(project_id) ON DELETE CASCADE,
    category_id INT REFERENCES category(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- 3. Seed at least 3 categories relevant to service projects
INSERT INTO category (category_name) VALUES 
('Disaster Relief'),
('Community Outreach'),
('Environmental');

-- 4. Associate your existing 15 projects with at least one category
-- This loops through your project IDs (1 to 15) and pairs them to categories (1, 2, or 3)
INSERT INTO project_category (project_id, category_id) 
SELECT id, (id % 3) + 1 FROM generate_series(1, 15) as id;
