"""add avatar_url to profiles

Revision ID: add_avatar_url
Revises: e567f0a04349
Create Date: 2026-01-19

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_avatar_url'
down_revision = 'e567f0a04349'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add avatar_url column to profiles table
    op.add_column('profiles', sa.Column('avatar_url', sa.String(length=500), nullable=True))


def downgrade() -> None:
    # Remove avatar_url column from profiles table
    op.drop_column('profiles', 'avatar_url')
