"""Seed the database with sample data for development and testing."""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

import asyncio
from datetime import datetime, timedelta
from sqlmodel import Session, select, create_engine
from app.models import User, Profile, Event, Post, Attendance, Reaction, ProfileType, ReactionType, TargetType, FairWorkPosting, EmploymentType, UnionStatus
from app.core.security import get_password_hash
from app.core.config import settings

# Create engine
engine = create_engine(settings.DATABASE_URL, echo=False)


async def seed_database():
    """Seed the database with sample data."""
    
    with Session(engine) as session:
        # Check if data already exists
        existing_users = session.exec(select(User)).first()
        if existing_users:
            print("⚠️  Database already has data. Skipping seed.")
            print("   Run 'docker-compose down -v' to reset the database.")
            return
        
        print("🌱 Seeding database...")
        
        # Create Users
        users_data = [
            {"email": "maya@riseup.local", "password": "password123", "name": "Maya Rodriguez", "bio": "Community organizer focused on housing justice and tenant rights.", "location": "Brooklyn, NY", "causes": ["Housing Justice", "Tenant Rights", "Mutual Aid"], "type": ProfileType.INDIVIDUAL},
            {"email": "jamal@riseup.local", "password": "password123", "name": "Jamal Washington", "bio": "Labor organizer working with service workers and restaurant staff.", "location": "Oakland, CA", "causes": ["Workers Rights", "Fair Wages", "Union Building"], "type": ProfileType.INDIVIDUAL},
            {"email": "rosa@riseup.local", "password": "password123", "name": "Rosa Chen", "bio": "Environmental justice advocate fighting for clean air and water.", "location": "Houston, TX", "causes": ["Environmental Justice", "Climate Action", "Community Health"], "type": ProfileType.INDIVIDUAL},
            {"email": "collective@riseup.local", "password": "password123", "name": "Southside Mutual Aid", "bio": "Neighborhood mutual aid network providing food, supplies, and community support.", "location": "Chicago, IL", "causes": ["Mutual Aid", "Food Justice", "Community Care"], "type": ProfileType.GROUP},
            {"email": "solidarity@riseup.local", "password": "password123", "name": "Teachers for Justice", "bio": "Educators organizing for fully funded schools and equitable education.", "location": "Detroit, MI", "causes": ["Education Justice", "Fully Funded Schools", "Student Support"], "type": ProfileType.GROUP},
        ]
        
        users = []
        profiles = []
        
        for user_data in users_data:
            # Create user
            user = User(
                email=user_data["email"],
                hashed_password=get_password_hash(user_data["password"])
            )
            session.add(user)
            session.flush()  # Get user.id
            
            # Create profile
            profile = Profile(
                user_id=user.id,
                name=user_data["name"],
                bio=user_data["bio"],
                location=user_data["location"],
                causes=user_data["causes"],
                profile_type=user_data["type"]
            )
            session.add(profile)
            session.flush()  # Get profile.id
            
            users.append(user)
            profiles.append(profile)
        
        print(f"✅ Created {len(users)} users and profiles")
        
        # Create Events
        now = datetime.utcnow()
        events_data = [
            {
                "creator": profiles[0],  # Maya
                "title": "Tenant Rights Workshop",
                "description": "Learn your rights as a tenant, how to organize with neighbors, and push back against unfair rent increases. We'll cover lease agreements, eviction defense, and forming tenant associations. Free legal aid available.",
                "event_date": now + timedelta(days=3),
                "location": "Brooklyn Community Center, 456 Flatbush Ave, Brooklyn NY",
                "latitude": 40.6782,
                "longitude": -73.9442,
                "tags": ["Housing Justice", "Tenant Rights", "Workshop", "Legal Aid"]
            },
            {
                "creator": profiles[1],  # Jamal
                "title": "Restaurant Workers Unite - Organizing Meeting",
                "description": "Join fellow restaurant workers to discuss fair wages, tip protection, and safe working conditions. We're building power together. All service industry workers welcome. Bring a coworker!",
                "event_date": now + timedelta(days=5),
                "location": "Oakland Labor Hall, 2315 Valdez St, Oakland CA",
                "latitude": 37.8044,
                "longitude": -122.2712,
                "tags": ["Workers Rights", "Union Building", "Restaurant Workers", "Fair Wages"]
            },
            {
                "creator": profiles[2],  # Rosa
                "title": "Community Air Quality March",
                "description": "March for clean air and environmental justice in our neighborhoods. We're demanding corporate polluters be held accountable. Families welcome. Signs provided.",
                "event_date": now + timedelta(days=7),
                "location": "Houston City Hall, 901 Bagby St, Houston TX",
                "latitude": 29.7604,
                "longitude": -95.3698,
                "tags": ["Environmental Justice", "Climate Action", "March", "Community Health"]
            },
            {
                "creator": profiles[3],  # Southside Mutual Aid
                "title": "Weekly Food Distribution",
                "description": "Free groceries and hot meals for anyone who needs them. No questions asked, no paperwork. Just neighbors helping neighbors. Volunteers always welcome!",
                "event_date": now + timedelta(days=2),
                "location": "Southside Park, 1101 S Wood St, Chicago IL",
                "latitude": 41.8681,
                "longitude": -87.6298,
                "tags": ["Mutual Aid", "Food Justice", "Community Care"]
            },
            {
                "creator": profiles[4],  # Teachers for Justice
                "title": "Rally for Fully Funded Schools",
                "description": "Teachers, parents, and students rallying for equitable school funding. Our kids deserve libraries, counselors, art programs, and safe buildings. Join us!",
                "event_date": now + timedelta(days=10),
                "location": "Michigan State Capitol, 100 N Capitol Ave, Lansing MI",
                "latitude": 42.7336,
                "longitude": -84.5467,
                "tags": ["Education Justice", "Fully Funded Schools", "Rally", "Student Support"]
            },
            {
                "creator": profiles[0],  # Maya
                "title": "Neighborhood Canvas for Rent Control",
                "description": "Going door-to-door to talk with neighbors about supporting rent control legislation. We'll provide training, scripts, and all materials. First-timers encouraged!",
                "event_date": now + timedelta(days=14),
                "location": "Brooklyn Community Center, 456 Flatbush Ave, Brooklyn NY",
                "latitude": 40.6782,
                "longitude": -73.9442,
                "tags": ["Housing Justice", "Rent Control", "Canvassing", "Community Organizing"]
            }
        ]
        
        events = []
        for event_data in events_data:
            event = Event(
                creator_id=event_data["creator"].id,
                title=event_data["title"],
                description=event_data["description"],
                event_date=event_data["event_date"],
                location=event_data["location"],
                latitude=event_data["latitude"],
                longitude=event_data["longitude"],
                tags=event_data["tags"]
            )
            session.add(event)
            events.append(event)
        
        session.flush()
        print(f"✅ Created {len(events)} events")
        
        # Create Posts
        posts_data = [
            {
                "creator": profiles[0],
                "text": "Just came back from the community board meeting. They're trying to rezone our neighborhood to allow luxury high-rises. We need everyone at the next meeting. Our community is not for sale. 💪"
            },
            {
                "creator": profiles[1],
                "text": "Proud to announce that 3 more restaurants joined our organizing campaign! Workers are tired of wage theft and unsafe conditions. When we fight, we win. ✊"
            },
            {
                "creator": profiles[2],
                "text": "Air quality monitors installed in our neighborhood show pollution levels 3x higher than wealthy areas across town. This is environmental racism and we're not staying quiet. 🌍"
            },
            {
                "creator": profiles[3],
                "text": "This week's food distribution served 200 families. We're building something beautiful here - a community that actually takes care of each other. If you have time to volunteer, we'd love to have you. ❤️"
            },
            {
                "creator": profiles[4],
                "text": "Our school library has been closed for 2 years due to 'budget cuts' while the district opens new charter schools. Teachers and parents are organizing. Enough is enough. 📚"
            },
            {
                "creator": profiles[1],
                "text": "Quick reminder: your boss needs you more than you need them. You have power. Use it. Organize your workplace. 💼"
            },
            {
                "creator": profiles[2],
                "text": "Amazing turnout at today's community meeting! 50+ residents showed up to demand clean water. The city can't ignore us anymore. This is what people power looks like. 💧"
            }
        ]
        
        posts = []
        for post_data in posts_data:
            post = Post(
                creator_id=post_data["creator"].id,
                text=post_data["text"]
            )
            session.add(post)
            posts.append(post)
        
        session.flush()
        print(f"✅ Created {len(posts)} posts")
        
        # Create Attendance (users attending events)
        attendances_data = [
            (users[1], events[0]),  # Jamal attending Maya's workshop
            (users[2], events[0]),  # Rosa attending Maya's workshop
            (users[0], events[1]),  # Maya attending Jamal's meeting
            (users[2], events[1]),  # Rosa attending Jamal's meeting
            (users[0], events[2]),  # Maya attending Rosa's march
            (users[1], events[2]),  # Jamal attending Rosa's march
            (users[0], events[3]),  # Maya attending food distribution
            (users[1], events[3]),  # Jamal attending food distribution
            (users[2], events[3]),  # Rosa attending food distribution
            (users[0], events[4]),  # Maya attending rally
            (users[1], events[4]),  # Jamal attending rally
        ]
        
        attendances = []
        for user, event in attendances_data:
            attendance = Attendance(
                user_id=user.id,
                event_id=event.id
            )
            session.add(attendance)
            attendances.append(attendance)
        
        session.flush()
        print(f"✅ Created {len(attendances)} event attendances")
        
        # Create Reactions (users reacting to posts)
        reactions_data = [
            (users[1], posts[0], ReactionType.SOLIDARITY),
            (users[2], posts[0], ReactionType.CARE),
            (users[0], posts[1], ReactionType.RESPECT),
            (users[2], posts[1], ReactionType.SOLIDARITY),
            (users[0], posts[2], ReactionType.CARE),
            (users[1], posts[2], ReactionType.SOLIDARITY),
            (users[0], posts[3], ReactionType.GRATITUDE),
            (users[1], posts[3], ReactionType.CARE),
            (users[2], posts[3], ReactionType.GRATITUDE),
            (users[0], posts[4], ReactionType.SOLIDARITY),
            (users[2], posts[4], ReactionType.RESPECT),
            (users[0], posts[5], ReactionType.SOLIDARITY),
            (users[2], posts[5], ReactionType.RESPECT),
            (users[1], posts[6], ReactionType.GRATITUDE),
            (users[0], posts[6], ReactionType.SOLIDARITY),
        ]
        
        reactions = []
        for user, post, reaction_type in reactions_data:
            reaction = Reaction(
                user_id=user.id,
                target_type=TargetType.POST,
                target_id=post.id,
                reaction_type=reaction_type
            )
            session.add(reaction)
            reactions.append(reaction)
        
        session.flush()
        print(f"✅ Created {len(reactions)} reactions")
        
        # Create Fair Work Postings
        postings_data = [
            {
                "title": "Community Organizer",
                "organization": "Workers United Cooperative",
                "location": "Brooklyn, NY",
                "wage_min": 55000,
                "wage_max": 65000,
                "wage_text": "$55,000 - $65,000/year",
                "employment_type": EmploymentType.FULL_TIME,
                "union_status": UnionStatus.UNIONIZED,
                "description": "Join our team organizing workers in the service industry. Build power with workers fighting for fair wages and safe conditions. Experience with labor organizing preferred but not required. We provide training and mentorship.",
                "worker_notes": "This is a union position with full benefits including health insurance, paid time off, and retirement contributions. Regular hours with occasional evening and weekend work for events.",
            },
            {
                "title": "Mutual Aid Coordinator",
                "organization": "Southside Community Network",
                "location": "Chicago, IL",
                "wage_min": 45000,
                "wage_max": 52000,
                "wage_text": "$45,000 - $52,000/year",
                "employment_type": EmploymentType.FULL_TIME,
                "union_status": UnionStatus.UNION_FRIENDLY,
                "description": "Coordinate food distribution, supply drives, and community support programs. Work directly with neighbors to build collective care networks. Strong communication skills and commitment to community-led organizing required.",
                "worker_notes": "Worker-friendly environment with flexible scheduling. Health insurance provided after 90 days. Organization is exploring unionization.",
            },
            {
                "title": "Legal Aid Paralegal",
                "organization": "Tenants Rights Legal Collective",
                "location": "Oakland, CA",
                "wage_min": 50000,
                "wage_max": 58000,
                "wage_text": "$50,000 - $58,000/year",
                "employment_type": EmploymentType.FULL_TIME,
                "union_status": UnionStatus.UNIONIZED,
                "description": "Support tenant defense cases and eviction prevention work. Assist attorneys with case preparation, client intake, and court filings. Bilingual Spanish/English strongly preferred.",
                "worker_notes": "Union position with OPEIU Local 29. Full benefits including health, dental, vision, and 15 days PTO. Remote work options available.",
                "application_url": "https://example.com/apply",
            },
            {
                "title": "Youth Program Facilitator",
                "organization": "Liberation Education Project",
                "location": "Detroit, MI",
                "wage_min": None,
                "wage_max": None,
                "wage_text": "$25/hour",
                "employment_type": EmploymentType.PART_TIME,
                "union_status": UnionStatus.UNION_FRIENDLY,
                "description": "Lead after-school programs focused on political education, art, and community building for youth ages 12-18. Create curriculum that centers youth voice and lived experience. 20 hours per week.",
                "worker_notes": "Part-time position with potential to grow. Stipend for professional development. Supportive, non-hierarchical work environment.",
            },
            {
                "title": "Delivery Driver",
                "organization": "Solidarity Delivery Cooperative",
                "location": "Portland, OR",
                "wage_min": None,
                "wage_max": None,
                "wage_text": "$22/hour + tips",
                "employment_type": EmploymentType.GIG,
                "union_status": UnionStatus.UNIONIZED,
                "description": "Worker-owned delivery cooperative. Set your own schedule. Fair pay with no algorithm manipulation. All drivers are co-op members with voting rights on company decisions.",
                "worker_notes": "This is a worker cooperative. All drivers become member-owners after 90 days. Profit-sharing quarterly. No surveillance or algorithmic management.",
                "application_url": "https://example.com/apply",
            },
            {
                "title": "Healthcare Navigator",
                "organization": "Community Health Access Network",
                "location": "Houston, TX",
                "wage_min": 42000,
                "wage_max": 48000,
                "wage_text": "$42,000 - $48,000/year",
                "employment_type": EmploymentType.FULL_TIME,
                "union_status": UnionStatus.UNION_FRIENDLY,
                "description": "Help community members access healthcare services, navigate insurance, and connect to resources. Bilingual Spanish/English required. Experience with healthcare systems and community organizing valued.",
                "worker_notes": "Health insurance provided. Flexible scheduling for family needs. Organization values work-life balance and worker input on policies.",
            },
        ]
        
        postings = []
        for posting_data in postings_data:
            posting = FairWorkPosting(**posting_data)
            session.add(posting)
            postings.append(posting)
        
        session.flush()
        print(f"✅ Created {len(postings)} fair work postings")
        
        # Commit all changes
        session.commit()
        
        print("\n🎉 Database seeded successfully!")
        print("\n📝 Test Accounts:")
        print("   Email: maya@riseup.local | Password: password123")
        print("   Email: jamal@riseup.local | Password: password123")
        print("   Email: rosa@riseup.local | Password: password123")
        print("   Email: collective@riseup.local | Password: password123")
        print("   Email: solidarity@riseup.local | Password: password123")
        print("\n🌐 API Docs: http://localhost:8000/docs")


if __name__ == "__main__":
    asyncio.run(seed_database())
