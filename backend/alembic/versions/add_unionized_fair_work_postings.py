"""add unionized fair work postings

Revision ID: f8a9b2c3d4e5
Revises: add_avatar_url
Create Date: 2026-01-19

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision = 'f8a9b2c3d4e5'
down_revision = 'add_avatar_url'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Add fair_work_postings table for Unionized section."""
    op.create_table(
        'fair_work_postings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
        sa.Column('organization', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
        sa.Column('location', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
        sa.Column('wage_min', sa.Float(), nullable=True),
        sa.Column('wage_max', sa.Float(), nullable=True),
        sa.Column('wage_text', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
        sa.Column('employment_type', sa.Enum('FULL_TIME', 'PART_TIME', 'CONTRACT', 'GIG', name='employmenttype'), nullable=False),
        sa.Column('union_status', sa.Enum('UNIONIZED', 'UNION_FRIENDLY', 'NOT_LISTED', name='unionstatus'), nullable=False),
        sa.Column('description', sqlmodel.sql.sqltypes.AutoString(length=2000), nullable=False),
        sa.Column('worker_notes', sqlmodel.sql.sqltypes.AutoString(length=1000), nullable=True),
        sa.Column('application_url', sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True),
        sa.Column('posted_date', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    """Remove fair_work_postings table."""
    op.drop_table('fair_work_postings')
