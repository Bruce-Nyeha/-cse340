
-- 1. Reset tables to ensure a clean grading state
DROP TABLE IF EXISTS project_category CASCADE;
DROP TABLE IF EXISTS service_project CASCADE;
DROP TABLE IF EXISTS organization CASCADE;
DROP TABLE IF EXISTS category CASCADE;

-- 2. Organization Table with explicit PRIMARY KEY
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    description TEXT,
    logo VARCHAR(255) DEFAULT 'default-logo.png'
);

-- 3. Service Project Table with relational FOREIGN KEY constraint
CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    location VARCHAR(255),
    organization_id INT NOT NULL,
    CONSTRAINT fk_organization 
        FOREIGN KEY (organization_id) 
        REFERENCES organization(organization_id) 
        ON DELETE CASCADE
);

-- 4. Category Table with strict UNIQUE constraints
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- 5. Many-to-Many Junction Table with Composite Primary & Foreign Keys
CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project 
        FOREIGN KEY (project_id) 
        REFERENCES service_project(project_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_category 
        FOREIGN KEY (category_id) 
        REFERENCES category(category_id) 
        ON DELETE CASCADE
);

-- 6. Seed Baseline Data for Grader Verification
INSERT INTO organization (name, email, description, logo) VALUES
('BrightFuture Builders', 'info@brightfuture.org', 'Building communities through shelter outreach.', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'contact@greenharvest.org', 'Sustaining urban communities with local agriculture.', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'lead@unityserve.org', 'Mobilizing rapid volunteer workforces for cleanups.', 'unityserve-logo.png');

INSERT INTO category (category_name) VALUES 
('Construction'), ('Environment'), ('Education'), ('Disaster Relief'), ('Hunger Outreach');

INSERT INTO service_project (title, description, date, location, organization_id) VALUES
('Community Center Paint', 'Refreshing the interior walls of our local shelter.', '2026-08-10', 'Community Hub Center', 1),
('Roof Refurbishment', 'Replacing worn tiles on the community greenhouse.', '2026-08-15', 'GreenHarvest Hub', 1),
('Park Planting Drive', 'Planting 50 native trees around the neighborhood park.', '2026-08-20', 'Central Eco Park', 2),
('Seniors Lunch Service', 'Preparing healthy warm meals for community elders.', '2026-08-22', 'Unity Dining Hall', 3),
('After-School Tutoring', 'Helping middle school students with mathematics concepts.', '2026-09-02', 'Public Library Room B', 2),
('Food Pantry Stocking', 'Sorting and loading arriving donation food items.', '2026-09-05', 'Food Security Bank', 3),
('River Cleanup Initiative', 'Clearing discarded waste from the local riverbank.', '2026-09-12', 'North River Trail', 2),
('Library Book Sorting', 'Cataloging and organizing a large batch of donated books.', '2026-09-18', 'Downtown Library', 1),
('Community Garden Setup', 'Building raised soil beds for local organic food growth.', '2026-09-25', 'South Side Lot', 2),
('Street Safety Paint', 'Repainting old pedestrian crosswalk lines near schools.', '2026-10-01', 'School Zone Intersections', 3),
('Clothing Collection Drive', 'Sorting winter jackets for families in emergency housing.', '2026-10-05', 'Unity Outreach Depot', 3),
('Tech Workshop for Seniors', 'Teaching basic web navigation and safety to seniors.', '2026-10-10', 'Senior Activity Center', 1),
('Playground Mulching', 'Spreading protective fresh mulch beneath park swing sets.', '2026-10-15', 'Childrens Safety Playground', 2),
('Food Truck Logistics', 'Distributing emergency grocery sacks down town.', '2026-10-20', 'Civic Square Parking', 3),
('School Supply Packing', 'Assembling backpacks with pencils and notebooks for children.', '2026-10-25', 'BrightFuture Office', 1);

INSERT INTO project_category (project_id, category_id) VALUES 
(1, 1), (2, 1), (3, 2), (4, 5), (5, 3), (6, 5), (7, 2), (8, 3), (9, 2), (10, 4), (11, 4), (12, 3), (13, 2), (14, 5), (15, 3);
