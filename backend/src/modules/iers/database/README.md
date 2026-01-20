# IERS Database Schema Guide

This directory contains the SQL schema definitions for the IERS (Integrated Resource & Education System) backend.

## 📂 File Structure

The scripts are numbered in order of dependency:

1.  **`01_rbac_system.sql`**: Core permissions and audit logging. **(Run First)**
2.  **`02_student_master.sql`**: Student profiles and related entities.
3.  **`03_faculty_master.sql`**: Faculty and research staff profiles.
4.  **`04_phd_lifecycle.sql`**: Doctoral application and guide allocation logic.
5.  **`05_workflow_engine.sql`**: Reusable approval engine for all modules.
6.  **`06_rac_rrc_review.sql`**: Research monitoring and thesis submission.
7.  **`07_naac_ssr_dvv.sql`**: Institutional accreditation and quality metrics.
8.  **`08_placement_training.sql`**: Corporate recruitment and skill development.

## 🚀 Execution Instructions

1.  Connect to your Supabase / PostgreSQL instance.
2.  Open the SQL Editor.
3.  Execute the scripts in numerical order.
4.  Each script enables **Row Level Security (RLS)** by default.

## 🛠 Note on RLS
All tables are configured with RLS. The backend uses the `SUPABASE_SERVICE_ROLE_KEY` to perform administrative and cross-module operations, bypassing RLS where necessary as per the project requirements.
