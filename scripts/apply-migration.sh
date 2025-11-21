#!/bin/bash

# Apply Database Migration Script
# This script helps apply the database migration to Supabase
# Usage: ./scripts/apply-migration.sh [method]
# Methods: cli (default), dashboard

set -e

METHOD=${1:-cli}
MIGRATION_FILE="supabase/migrations/20240115000000_initial_schema.sql"

echo "🚀 Sprint Dashboard - Database Migration Tool"
echo "=============================================="
echo ""

# Check if migration file exists
if [ ! -f "$MIGRATION_FILE" ]; then
  echo "❌ Error: Migration file not found: $MIGRATION_FILE"
  exit 1
fi

echo "📄 Migration file: $MIGRATION_FILE"
echo ""

case $METHOD in
  cli)
    echo "📦 Method: Supabase CLI"
    echo ""
    
    # Check if Supabase CLI is installed
    if ! command -v supabase &> /dev/null; then
      echo "❌ Error: Supabase CLI not found"
      echo "   Install it with: npm install -g supabase"
      echo "   Or: brew install supabase/tap/supabase"
      exit 1
    fi
    
    echo "✅ Supabase CLI found"
    echo ""
    
    # Check if project is linked
    if [ ! -f "supabase/.temp/project-ref" ]; then
      echo "⚠️  Project not linked to remote Supabase"
      echo "   Linking project..."
      echo "   Run: supabase link --project-ref YOUR_PROJECT_REF"
      echo "   Or continue to apply migration locally"
      read -p "   Continue with local migration? (y/n) " -n 1 -r
      echo
      if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
      fi
    fi
    
    echo "🔄 Applying migration..."
    echo ""
    
    # Apply migration
    if supabase db push; then
      echo ""
      echo "✅ Migration applied successfully!"
      echo ""
      echo "📊 Next steps:"
      echo "   1. Verify tables in Supabase dashboard"
      echo "   2. Test queries using the views"
      echo "   3. Run: npm run dev and test /api/test-db"
    else
      echo ""
      echo "❌ Migration failed. Check the error above."
      exit 1
    fi
    ;;
    
  dashboard)
    echo "🌐 Method: Supabase Dashboard (SQL Editor)"
    echo ""
    echo "📋 Instructions:"
    echo "   1. Open Supabase Dashboard: https://app.supabase.com"
    echo "   2. Navigate to: SQL Editor"
    echo "   3. Click 'New Query'"
    echo "   4. Copy the contents of: $MIGRATION_FILE"
    echo "   5. Paste into SQL Editor"
    echo "   6. Click 'Run'"
    echo ""
    echo "📄 Migration file location:"
    echo "   $(pwd)/$MIGRATION_FILE"
    echo ""
    read -p "   Press Enter to open the migration file..."
    
    # Try to open file in default editor
    if command -v code &> /dev/null; then
      code "$MIGRATION_FILE"
    elif command -v nano &> /dev/null; then
      nano "$MIGRATION_FILE"
    else
      cat "$MIGRATION_FILE"
    fi
    ;;
    
  *)
    echo "❌ Error: Unknown method: $METHOD"
    echo ""
    echo "Usage: ./scripts/apply-migration.sh [method]"
    echo "Methods:"
    echo "  cli       - Apply using Supabase CLI (default)"
    echo "  dashboard - Show instructions for Supabase Dashboard"
    exit 1
    ;;
esac

echo ""
echo "✨ Done!"

