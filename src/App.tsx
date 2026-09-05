import React, { useEffect, useState } from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  Link,
} from 'react-router-dom';

import { Auth } from './components/Auth';
import { StudentPortal } from './components/StudentPortal';
import { AdminPortal } from './components/AdminPortal';
import { RecruiterPortal } from './components/RecruiterPortal';
import { AlumniPortal } from './components/AlumniPortal';

import { LandingPage } from './components/LandingPage';
import { FeaturesPage } from './components/FeaturesPage';
import { HowItWorksPage } from './components/HowItWorksPage';

import { Notification } from './components/Notification';
import { RouteLoadingBar } from './components/RouteLoadingBar';

import type { ToastType } from './components/Notification';

import {
  INITIAL_STUDENTS,
  INITIAL_DRIVES,
  INITIAL_RECRUITERS,
} from './mockData';

import type {
  Student,
  PlacementDrive,
  Application,
  Recruiter,
  ResumeFeedback,
} from './mockData';

import { INITIAL_CALENDAR_EVENTS } from './mockCalendar';

import type { CalendarEvent } from './api/types';

import {
  INITIAL_ALUMNI,
  INITIAL_BLOGS,
  INITIAL_REFERRALS,
} from './mockAlumni';

import type {
  Alumni,
  Blog,
  Referral,
} from './api/alumniApi';

import {
  GraduationCap,
  LogOut,
  Shield,
  Building2,
  Award,
} from 'lucide-react';

import { motion } from 'motion/react';


/* =========================================================
   SESSION TYPES
========================================================= */

type UserRole =
  | 'student'
  | 'admin'
  | 'recruiter'
  | 'alumni';

interface Session {
  role: UserRole;
  studentId?: string;
  recruiterId?: string;
  alumniId?: string;
}


/* =========================================================
   PROTECTED ROUTE
========================================================= */

const ProtectedRoute = ({
  children,
  allowedRole,
  session,
}: {
  children: React.ReactElement;
  allowedRole: UserRole;
  session: Session | null;
}) => {
  /*
   * User is not logged in.
   */
  if (!session) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  /*
   * User is logged in but trying to access
   * another role's portal.
   */
  if (session.role !== allowedRole) {
    return (
      <Navigate
        to={`/${session.role}`}
        replace
      />
    );
  }

  return children;
};


/* =========================================================
   LANDING PAGE NAVIGATION
========================================================= */

function NavLinksWithSlidingUnderline() {
  const location = useLocation();
  const navigate = useNavigate();

  const [hoveredPath, setHoveredPath] =
    useState<string | null>(null);

  const navItems = [
    {
      path: '/',
      label: 'Home',
    },
    {
      path: '/features',
      label: 'Features',
    },
    {
      path: '/how-it-works',
      label: 'How it Works',
    },
  ];

  const activePath =
    hoveredPath !== null
      ? hoveredPath
      : location.pathname;

  return (
    <nav
      className="landing-nav-links"
      onMouseLeave={() => setHoveredPath(null)}
    >
      {navItems.map((item) => {
        const isRouteActive =
          location.pathname === item.path;

        const isTargeted =
          activePath === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            onMouseEnter={() =>
              setHoveredPath(item.path)
            }
            className={`
              landing-nav-link
              relative
              py-1
              px-1
              transition-colors
              duration-200
              ${
                isRouteActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-700 hover:text-blue-600'
              }
            `}
          >
            <span className="relative z-10">
              {item.label}
            </span>

            {isTargeted && (
              <motion.div
                layoutId="landing-nav-sliding-underline"
                className="
                  absolute
                  -bottom-0.5
                  left-0
                  right-0
                  h-[2.5px]
                  bg-blue-600
                  rounded-full
                  pointer-events-none
                "
                transition={{
                  type: 'spring',
                  stiffness: 450,
                  damping: 32,
                }}
              />
            )}
          </Link>
        );
      })}

      <button
        onClick={() =>
          navigate('/auth?mode=login')
        }
        className="landing-nav-btn"
      >
        Sign In
      </button>
    </nav>
  );
}


/* =========================================================
   MAIN APP CONTENT
========================================================= */

function AppContent() {
  const navigate = useNavigate();


  /* =======================================================
     STUDENTS
  ======================================================= */

  const [students, setStudents] =
    useState<Student[]>(() => {
      const saved =
        localStorage.getItem('tpo_students');

      return saved
        ? JSON.parse(saved)
        : [];
    });


  /* =======================================================
     PLACEMENT DRIVES
  ======================================================= */

  const [drives, setDrives] =
    useState<PlacementDrive[]>(() => {
      const saved =
        localStorage.getItem('tpo_drives');

      return saved
        ? JSON.parse(saved)
        : [];
    });


  /* =======================================================
     RECRUITERS
  ======================================================= */

  const [recruiters, setRecruiters] =
    useState<Recruiter[]>(() => {
      const saved =
        localStorage.getItem('tpo_recruiters');

      return saved
        ? JSON.parse(saved)
        : [];
    });


  /* =======================================================
     ALUMNI
  ======================================================= */

  const [alumni, setAlumni] =
    useState<Alumni[]>(() => {
      const saved =
        localStorage.getItem('tpo_alumni');

      return saved
        ? JSON.parse(saved)
        : INITIAL_ALUMNI;
    });


  /* =======================================================
     ALUMNI BLOGS
  ======================================================= */

  const [blogs, setBlogs] =
    useState<Blog[]>(() => {
      const saved =
        localStorage.getItem(
          'tpo_alumni_blogs'
        );

      return saved
        ? JSON.parse(saved)
        : INITIAL_BLOGS;
    });


  /* =======================================================
     ALUMNI REFERRALS
  ======================================================= */

  const [referrals, setReferrals] =
    useState<Referral[]>(() => {
      const saved =
        localStorage.getItem(
          'tpo_alumni_referrals'
        );

      return saved
        ? JSON.parse(saved)
        : INITIAL_REFERRALS;
    });


  /* =======================================================
     CALENDAR EVENTS
  ======================================================= */

  const [calendarEvents, setCalendarEvents] =
    useState<CalendarEvent[]>(
      INITIAL_CALENDAR_EVENTS
    );


  /* =======================================================
     SESSION
  ======================================================= */

  const [session, setSession] =
    useState<Session | null>(null);


  /* =======================================================
     TOAST
  ======================================================= */

  const [toast, setToast] =
    useState<ToastType | null>(null);


  /* =======================================================
     TOAST HELPER
  ======================================================= */

  const triggerToast = (
    message: string,
    type:
      | 'success'
      | 'error'
      | 'warning'
      | 'info'
  ) => {
    setToast({
      id: Math.random()
        .toString(36)
        .substring(2, 11),
      message,
      type,
    });
  };


  /* =======================================================
     LOCAL STORAGE
  ======================================================= */

  useEffect(() => {
    localStorage.setItem(
      'tpo_students',
      JSON.stringify(students)
    );
  }, [students]);


  useEffect(() => {
    localStorage.setItem(
      'tpo_drives',
      JSON.stringify(drives)
    );
  }, [drives]);


  useEffect(() => {
    localStorage.setItem(
      'tpo_recruiters',
      JSON.stringify(recruiters)
    );
  }, [recruiters]);


  useEffect(() => {
    localStorage.setItem(
      'tpo_alumni',
      JSON.stringify(alumni)
    );
  }, [alumni]);


  useEffect(() => {
    localStorage.setItem(
      'tpo_alumni_blogs',
      JSON.stringify(blogs)
    );
  }, [blogs]);


  useEffect(() => {
    localStorage.setItem(
      'tpo_alumni_referrals',
      JSON.stringify(referrals)
    );
  }, [referrals]);


  /* =======================================================
     SEED DATA
  ======================================================= */

  const handleSeedData = () => {
    setStudents(INITIAL_STUDENTS);
    setDrives(INITIAL_DRIVES);
    setRecruiters(INITIAL_RECRUITERS);

    triggerToast(
      'Sample data seeded successfully. Feel free to log in!',
      'success'
    );
  };


  /* =======================================================
     LOGIN
  ======================================================= */

  const handleLogin = (
    role: UserRole,
    id?: string
  ) => {

    /* ---------------- STUDENT ---------------- */

    if (role === 'student') {
      setSession({
        role,
        studentId: id,
      });

      const student =
        students.find(
          (student) => student.id === id
        );

      triggerToast(
        `Welcome back, ${
          student?.name || 'Student'
        }!`,
        'success'
      );

      navigate('/student');

      return;
    }


    /* ---------------- RECRUITER ---------------- */

    if (role === 'recruiter') {
      setSession({
        role,
        recruiterId: id,
      });

      const recruiter =
        recruiters.find(
          (recruiter) =>
            recruiter.id === id
        );

      triggerToast(
        `Welcome back, ${
          recruiter?.name || 'Recruiter'
        } from ${
          recruiter?.companyName || 'Company'
        }!`,
        'success'
      );

      navigate('/recruiter');

      return;
    }


    /* ---------------- ALUMNI ---------------- */

    if (role === 'alumni') {
      const alum =
        alumni.find(
          (item) => item.id === id
        );

      if (!alum) {
        triggerToast(
          'Alumni account not found.',
          'error'
        );

        return;
      }

      /*
       * Alumni must be approved by TPO
       * before portal access.
       */
      if (
        alum.alumniStatus !== 'APPROVED'
      ) {
        triggerToast(
          'Your Alumni account is awaiting TPO approval.',
          'warning'
        );

        return;
      }

      setSession({
        role,
        alumniId: id,
      });

      triggerToast(
        `Welcome back, ${alum.name}!`,
        'success'
      );

      navigate('/alumni');

      return;
    }


    /* ---------------- ADMIN ---------------- */

    setSession({
      role: 'admin',
    });

    triggerToast(
      'Administrator authenticated successfully.',
      'success'
    );

    navigate('/admin');
  };


  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    setSession(null);

    triggerToast(
      'Logged out successfully.',
      'info'
    );

    navigate('/auth?mode=login');
  };


  /* =======================================================
     STUDENT APPLY TO DRIVE
  ======================================================= */

  const handleApplyDrive = (
    driveId: string
  ) => {
    if (
      !session ||
      session.role !== 'student' ||
      !session.studentId
    ) {
      return;
    }

    const student =
      students.find(
        (item) =>
          item.id === session.studentId
      );

    const drive =
      drives.find(
        (item) => item.id === driveId
      );

    if (!student || !drive) {
      return;
    }


    /*
     * Prevent duplicate applications.
     */

    if (
      student.applications.some(
        (application) =>
          application.driveId === driveId
      )
    ) {
      triggerToast(
        'You have already submitted an application for this drive.',
        'warning'
      );

      return;
    }


    const newApplication: Application = {
      driveId: drive.id,
      jobPostingId: drive.id,
      companyName: drive.companyName,
      role: drive.title,
      appliedDate:
        new Date()
          .toISOString()
          .split('T')[0],
      status: 'Applied',
      currentRoundIndex: 0,
    };


    setStudents(
      (previousStudents) =>
        previousStudents.map(
          (studentItem) => {
            if (
              studentItem.id ===
              session.studentId
            ) {
              return {
                ...studentItem,
                applications: [
                  newApplication,
                  ...studentItem.applications,
                ],
              };
            }

            return studentItem;
          }
        )
    );


    setDrives(
      (previousDrives) =>
        previousDrives.map(
          (driveItem) => {
            if (
              driveItem.id === driveId
            ) {
              return {
                ...driveItem,
                registeredCount:
                  (driveItem.registeredCount ||
                    0) + 1,
              };
            }

            return driveItem;
          }
        )
    );


    triggerToast(
      `Application submitted successfully for ${drive.companyName}!`,
      'success'
    );
  };


  /* =======================================================
     STUDENT RESUME SCORE
  ======================================================= */

  const handleUpdateResumeScore = (
    score: number,
    resumeText: string
  ) => {
    if (
      !session ||
      session.role !== 'student' ||
      !session.studentId
    ) {
      return;
    }

    setStudents(
      (previousStudents) =>
        previousStudents.map(
          (student) => {
            if (
              student.id ===
              session.studentId
            ) {
              return {
                ...student,
                resumeScore: score,
                resumeText,
              };
            }

            return student;
          }
        )
    );

    triggerToast(
      `Resume index optimized! New ATS Score: ${score}%`,
      'success'
    );
  };


  /* =======================================================
     STUDENT PROFILE UPDATE
  ======================================================= */

  const handleUpdateStudentProfile = (
    updatedStudent: Student
  ) => {
    setStudents(
      (previousStudents) =>
        previousStudents.map(
          (student) =>
            student.id === updatedStudent.id
              ? updatedStudent
              : student
        )
    );

    triggerToast(
      'Profile settings saved successfully.',
      'success'
    );
  };


  /* =======================================================
     ADD PLACEMENT DRIVE
  ======================================================= */

  const handleAddDrive = (
    newDriveData: Omit<
      PlacementDrive,
      'id' | 'registeredCount'
    >,
    recruiterId?: string
  ) => {

    const newDrive: PlacementDrive = {
      ...newDriveData,
      id:
        `drv_${Math.random()
          .toString(36)
          .substring(2, 11)}`,
      registeredCount: 0,
      recruiterId,
    };


    setDrives(
      (previousDrives) => [
        newDrive,
        ...previousDrives,
      ]
    );


    /*
     * Automatically create a calendar
     * event when the drive has a deadline.
     */

    if (newDriveData.deadline) {
      const driveCalendarEvent: CalendarEvent = {
        id: Date.now(),

        title:
          `${newDriveData.companyName} - ${newDriveData.title}`,

        eventType: 'Deadline',

        companyName:
          newDriveData.companyName,

        company:
          newDriveData.companyName,

        role:
          newDriveData.title,

        scheduledDate:
          newDriveData.deadline,

        startTime: '23:59',

        location:
          newDriveData.location ||
          'Campus / Online',

        description:
          `Registration deadline for ${newDriveData.companyName} (${newDriveData.title}). Package: ${newDriveData.package}.`,

        status: 'SCHEDULED',
      };

      setCalendarEvents(
        (previousEvents) => [
          driveCalendarEvent,
          ...previousEvents,
        ]
      );
    }


    triggerToast(
      `Recruitment drive for ${newDrive.companyName} created successfully!`,
      'success'
    );
  };


  /* =======================================================
     ADD CALENDAR EVENT
  ======================================================= */

  const handleAddCalendarEvent = (
    newEvent: CalendarEvent
  ) => {
    setCalendarEvents(
      (previousEvents) => [
        newEvent,
        ...previousEvents,
      ]
    );

    triggerToast(
      `Calendar Event "${newEvent.title}" published!`,
      'success'
    );
  };


  /* =======================================================
     TOGGLE DRIVE ACTIVE / CLOSED
  ======================================================= */

  const handleToggleDriveActive = (
    driveId: string
  ) => {

    setDrives(
      (previousDrives) =>
        previousDrives.map(
          (drive) => {

            if (
              drive.id === driveId
            ) {
              const nextStatus =
                drive.status === 'OPEN'
                  ? 'CLOSED'
                  : 'OPEN';

              triggerToast(
                `Drive for ${drive.companyName} has been ${
                  nextStatus === 'OPEN'
                    ? 'activated'
                    : 'suspended'
                }.`,
                nextStatus === 'OPEN'
                  ? 'success'
                  : 'warning'
              );

              return {
                ...drive,
                status:
                  nextStatus as
                    | 'OPEN'
                    | 'CLOSED',
              };
            }

            return drive;
          }
        )
    );
  };


  /* =======================================================
     UPDATE STUDENT PLACEMENT STATUS
  ======================================================= */

  const handleUpdateStudentStatus = (
    studentId: string,
    company?: string,
    salaryPackage?: string
  ) => {

    const student =
      students.find(
        (item) =>
          item.id === studentId
      );

    if (!student) {
      return;
    }


    setStudents(
      (previousStudents) =>
        previousStudents.map(
          (studentItem) => {

            if (
              studentItem.id === studentId
            ) {

              /*
               * Mark as placed.
               */

              if (
                company &&
                salaryPackage
              ) {

                triggerToast(
                  `${studentItem.name} marked as Placed @ ${company}!`,
                  'success'
                );

                return {
                  ...studentItem,

                  placementStatus:
                    'Placed' as const,

                  placedCompany:
                    company,

                  placedPackage:
                    salaryPackage,
                };
              }


              /*
               * Reset placement.
               */

              triggerToast(
                `${studentItem.name} status reset to Unplaced.`,
                'info'
              );

              return {
                ...studentItem,

                placementStatus:
                  'Unplaced' as const,

                placedCompany:
                  undefined,

                placedPackage:
                  undefined,
              };
            }

            return studentItem;
          }
        )
    );
  };


  /* =======================================================
     PROMOTE STUDENT IN PLACEMENT PIPELINE
  ======================================================= */

  const handlePromoteStudent = (
    studentId: string,
    driveId: string,
    newRoundIndex: number,
    isFinalSelection: boolean
  ) => {

    const student =
      students.find(
        (item) =>
          item.id === studentId
      );

    const drive =
      drives.find(
        (item) =>
          item.id === driveId
      );

    if (!student || !drive) {
      return;
    }


    setStudents(
      (previousStudents) =>
        previousStudents.map(
          (studentItem) => {

            if (
              studentItem.id !==
              studentId
            ) {
              return studentItem;
            }


            const updatedApplications =
              studentItem.applications.map(
                (application) => {

                  if (
                    application.jobPostingId !==
                    driveId
                  ) {
                    return application;
                  }


                  /*
                   * Final selection.
                   */

                  if (
                    isFinalSelection
                  ) {
                    return {
                      ...application,

                      status:
                        'Selected' as const,

                      currentRoundIndex:
                        newRoundIndex - 1,

                      feedback:
                        `Offer issued! Selected for the role of ${drive.title} with a salary package of ${drive.package}.`,
                    };
                  }


                  /*
                   * Move to next round.
                   */

                  const nextRoundName =
                    drive.rounds
                      ? drive.rounds[
                          newRoundIndex
                        ]
                      : `Round ${
                          newRoundIndex + 1
                        }`;

                  return {
                    ...application,

                    status:
                      nextRoundName as any,

                    currentRoundIndex:
                      newRoundIndex,

                    feedback:
                      `Successfully cleared stage. Promoted to "${nextRoundName}".`,
                  };
                }
              );


            /*
             * If selected, update
             * student's placement details.
             */

            if (
              isFinalSelection
            ) {
              return {
                ...studentItem,

                placementStatus:
                  'Placed' as const,

                placedCompany:
                  drive.companyName,

                placedPackage:
                  String(drive.package),

                applications:
                  updatedApplications,
              };
            }


            return {
              ...studentItem,

              applications:
                updatedApplications,
            };
          }
        )
    );


    if (isFinalSelection) {
      triggerToast(
        `Congratulations! ${student.name} has been selected for ${drive.companyName}!`,
        'success'
      );
    } else {
      triggerToast(
        `${student.name} promoted to "${drive.rounds?.[newRoundIndex] || `Round ${newRoundIndex + 1}`}" for ${drive.companyName}.`,
        'success'
      );
    }
  };


  /* =======================================================
     REJECT STUDENT
  ======================================================= */

  const handleRejectStudent = (
    studentId: string,
    driveId: string
  ) => {

    const student =
      students.find(
        (item) =>
          item.id === studentId
      );

    const drive =
      drives.find(
        (item) =>
          item.id === driveId
      );

    if (!student || !drive) {
      return;
    }


    setStudents(
      (previousStudents) =>
        previousStudents.map(
          (studentItem) => {

            if (
              studentItem.id !==
              studentId
            ) {
              return studentItem;
            }


            return {
              ...studentItem,

              applications:
                studentItem.applications.map(
                  (application) => {

                    if (
                      application.jobPostingId !==
                      driveId
                    ) {
                      return application;
                    }

                    return {
                      ...application,

                      status:
                        'Rejected' as const,

                      feedback:
                        `Recruitment cycle concluded at stage "${drive.rounds?.[application.currentRoundIndex] || 'Current Stage'}". Better luck next time!`,
                    };
                  }
                ),
            };
          }
        )
    );


    triggerToast(
      `${student.name} marked as Rejected for ${drive.companyName}.`,
      'warning'
    );
  };


  /* =======================================================
     SAVE RESUME FEEDBACK
  ======================================================= */

  const saveFeedback = (
    studentId: string,
    feedback: ResumeFeedback
  ) => {

    setStudents(
      (previousStudents) =>
        previousStudents.map(
          (student) =>
            student.id === studentId
              ? {
                  ...student,
                  resumeFeedback:
                    feedback,
                }
              : student
        )
    );
  };


  /* =======================================================
     REGISTER STUDENT
  ======================================================= */

  const handleRegisterStudent = (
    newStudent: Student
  ) => {

    setStudents(
      (previousStudents) => [
        ...previousStudents,
        newStudent,
      ]
    );

    triggerToast(
      'Student registration successful! Please sign in.',
      'success'
    );
  };


  /* =======================================================
     REGISTER RECRUITER
  ======================================================= */

  const handleRegisterRecruiter = (
    newRecruiter: Recruiter
  ) => {

    setRecruiters(
      (previousRecruiters) => [
        ...previousRecruiters,
        newRecruiter,
      ]
    );

    triggerToast(
      `Recruiter account created for ${newRecruiter.companyName}! Please sign in.`,
      'success'
    );
  };


  /* =======================================================
     REGISTER ALUMNI
  ======================================================= */

  const handleRegisterAlumni = (
    newAlumni: Alumni
  ) => {

    /*
     * Newly registered alumni are always
     * PENDING until approved by TPO.
     */

    setAlumni(
      (previousAlumni) => [
        ...previousAlumni,
        {
          ...newAlumni,
          alumniStatus: 'PENDING',
        },
      ]
    );

    triggerToast(
      'Alumni registration submitted. TPO approval is required before portal access.',
      'success'
    );
  };


  /* =======================================================
     APPROVE ALUMNI
  ======================================================= */

  const handleApproveAlumni = (
    alumniId: string
  ) => {

    const person =
      alumni.find(
        (item) =>
          item.id === alumniId
      );


    setAlumni(
      (previousAlumni) =>
        previousAlumni.map(
          (item) =>
            item.id === alumniId
              ? {
                  ...item,
                  alumniStatus:
                    'APPROVED',
                }
              : item
        )
    );


    triggerToast(
      `${person?.name || 'Alumni'} approved successfully.`,
      'success'
    );
  };


  /* =======================================================
     REJECT ALUMNI
  ======================================================= */

  const handleRejectAlumni = (
    alumniId: string
  ) => {

    const person =
      alumni.find(
        (item) =>
          item.id === alumniId
      );


    /*
     * Since the current AlumniStatus model
     * only contains PENDING and APPROVED,
     * rejection removes the pending
     * registration from the frontend store.
     */

    setAlumni(
      (previousAlumni) =>
        previousAlumni.filter(
          (item) =>
            item.id !== alumniId
        )
    );


    triggerToast(
      `${person?.name || 'Alumni registration'} rejected.`,
      'warning'
    );
  };


  /* =======================================================
     ADD BLOG
  ======================================================= */


  

  const handleAddBlog = (
  blogData: Omit<
    Blog,
    'id' | 'alumniId' | 'postedDate'
  >
) => {
  if (!session?.alumniId) {
    return;
  }

  const newBlog: Blog = {
    ...blogData,
    id:
      `blog_${Math.random()
        .toString(36)
        .substring(2, 11)}`,
    alumniId: session.alumniId,
    postedDate:
      new Date()
        .toISOString()
        .split('T')[0],
  };

  setBlogs((previousBlogs) => [
    newBlog,
    ...previousBlogs,
  ]);

  triggerToast(
    newBlog.published
      ? 'Blog published successfully.'
      : 'Blog saved as draft.',
    'success'
  );
};

  /* =======================================================
     UPDATE BLOG
  ======================================================= */

  const handleUpdateBlog = (
  id: string,
  data: {
    title: string;
    content: string;
    category: Blog['category'];
    published: boolean;
  }
) => {
  setBlogs((previousBlogs) =>
    previousBlogs.map((blog) =>
      blog.id === id
        ? {
            ...blog,
            title: data.title,
            content: data.content,
            category: data.category,
            published: data.published,
          }
        : blog
    )
  );

  triggerToast(
    'Blog updated successfully.',
    'success'
  );
};

  /* =======================================================
     DELETE BLOG
  ======================================================= */

  const handleDeleteBlog = (
  blogId: string
) => {
  setBlogs((previousBlogs) =>
    previousBlogs.filter(
      (blog) => blog.id !== blogId
    )
  );

  triggerToast(
    'Blog deleted.',
    'info'
  );
};


  /* =======================================================
     ADD REFERRAL
  ======================================================= */

  const handleAddReferral = (
  referralData: Omit<
    Referral,
    'id' | 'alumniId' | 'postedDate'
  >
) => {
  if (!session?.alumniId) {
    return;
  }

  const newReferral: Referral = {
    ...referralData,
    id:
      `ref_${Math.random()
        .toString(36)
        .substring(2, 11)}`,
    alumniId: session.alumniId,
    postedDate:
      new Date()
        .toISOString()
        .split('T')[0],
  };

  setReferrals((previousReferrals) => [
    newReferral,
    ...previousReferrals,
  ]);

  triggerToast(
    'Referral opportunity posted successfully.',
    'success'
  );
};
  /* =======================================================
     TOGGLE REFERRAL
  ======================================================= */

  const handleToggleReferral = (
    referralId: string
  ) => {

    setReferrals(
      (previousReferrals) =>
        previousReferrals.map(
          (referral) =>
            referral.id === referralId
              ? {
                  ...referral,
                  active:
                    !referral.active,
                }
              : referral
        )
    );

    triggerToast(
      'Referral status updated.',
      'success'
    );
  };


  /* =======================================================
     UPDATE ALUMNI PROFILE
  ======================================================= */

  const handleUpdateAlumniProfile = (
  updatedAlumni: Alumni
) => {
  setAlumni((previousAlumni) =>
    previousAlumni.map((item) =>
      item.id === updatedAlumni.id
        ? updatedAlumni
        : item
    )
  );

  triggerToast(
    'Alumni profile saved successfully.',
    'success'
  );
};
  /* =======================================================
     GET LOGGED-IN STUDENT
  ======================================================= */

  const loggedInStudent =
    session?.role === 'student'
      ? students.find(
          (student) =>
            student.id ===
            session.studentId
        )
      : undefined;


  /* =======================================================
     GET LOGGED-IN RECRUITER
  ======================================================= */

  const loggedInRecruiter =
    session?.role === 'recruiter'
      ? recruiters.find(
          (recruiter) =>
            recruiter.id ===
            session.recruiterId
        )
      : undefined;


  /* =======================================================
     GET LOGGED-IN ALUMNI
  ======================================================= */

  const loggedInAlumni =
    session?.role === 'alumni'
      ? alumni.find(
          (item) =>
            item.id ===
            session.alumniId
        )
      : undefined;


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="app-shell">

      {/* Route Loading Transition */}

      <RouteLoadingBar />


      {/* Global Notifications */}

      <Notification
        toast={toast}
        onClose={() =>
          setToast(null)
        }
      />


      {/* ===================================================
          GLOBAL HEADER
      =================================================== */}

      <header className="app-header">

        <div className="app-logo">

          <GraduationCap
            className="logo-icon animate-pulse"
            size={26}
          />

          <Link
            to="/"
            className="
              font-display
              font-extrabold
              text-xl
              text-[hsl(var(--text-primary))]
              hover:opacity-90
              no-underline
            "
          >
            PlaceX
          </Link>

        </div>


        {/* =================================================
            LOGGED-IN USER HEADER
        ================================================= */}

        {session ? (

          <div className="user-nav-profile">

            {/* ---------------- STUDENT ---------------- */}

            {session.role === 'student' &&
            loggedInStudent ? (

              <div className="flex items-center gap-3">

                <div className="hidden sm:flex flex-col text-right">

                  <span className="
                    text-xs
                    font-semibold
                    text-[hsl(var(--text-primary))]
                    truncate
                    max-w-30
                  ">
                    {loggedInStudent.name}
                  </span>

                  <span className="
                    text-[10px]
                    text-[hsl(var(--text-secondary))]
                    font-semibold
                    uppercase
                  ">
                    {loggedInStudent.department}
                  </span>

                </div>

                <div className="avatar">
                  {loggedInStudent.name.charAt(0)}
                </div>

              </div>


            ) : session.role === 'recruiter' &&
              loggedInRecruiter ? (

              /* ---------------- RECRUITER ---------------- */

              <div className="flex items-center gap-3">

                <div className="hidden sm:flex flex-col text-right">

                  <span className="
                    text-xs
                    font-semibold
                    text-[hsl(var(--text-primary))]
                    truncate
                    max-w-30
                  ">
                    {loggedInRecruiter.name}
                  </span>

                  <span className="
                    text-[10px]
                    text-sky-600
                    font-bold
                    uppercase
                    tracking-wider
                  ">
                    {loggedInRecruiter.companyName}
                    {' '}Recruiter
                  </span>

                </div>

                <div className="
                  avatar
                  bg-linear-to-br
                  from-sky-400
                  to-blue-600
                ">
                  <Building2
                    size={16}
                    className="text-white"
                  />
                </div>

              </div>


            ) : session.role === 'alumni' &&
              loggedInAlumni ? (

              /* ---------------- ALUMNI ---------------- */

              <div className="flex items-center gap-3">

                <div className="hidden sm:flex flex-col text-right">

                  <span className="
                    text-xs
                    font-semibold
                    text-[hsl(var(--text-primary))]
                  ">
                    {loggedInAlumni.name}
                  </span>

                  <span className="
                    text-[10px]
                    text-amber-600
                    font-bold
                    uppercase
                    tracking-wider
                  ">
                    {loggedInAlumni.currentCompany}
                    {' '}Alumni
                  </span>

                </div>

                <div className="
                  avatar
                  bg-linear-to-br
                  from-amber-400
                  to-orange-600
                ">
                  <Award
                    size={16}
                    className="text-white"
                  />
                </div>

              </div>


            ) : (

              /* ---------------- ADMIN ---------------- */

              <div className="flex items-center gap-3">

                <div className="hidden sm:flex flex-col text-right">

                  <span className="
                    text-xs
                    font-semibold
                    text-[hsl(var(--text-primary))]
                  ">
                    TPO Coordinator
                  </span>

                  <span className="
                    text-[10px]
                    text-blue-600
                    font-bold
                    uppercase
                    tracking-wider
                  ">
                    Administrator
                  </span>

                </div>

                <div className="
                  avatar
                  bg-linear-to-br
                  from-blue-500
                  to-indigo-600
                ">
                  <Shield
                    size={16}
                    className="text-white"
                  />
                </div>

              </div>
            )}


            {/* LOGOUT */}

            <button
              onClick={handleLogout}
              className="
                btn
                btn-secondary
                btn-sm
                p-1.5
                rounded-lg
                text-gray-500
                hover:text-red-600
                transition-colors
              "
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>

          </div>

        ) : (

          /* =================================================
             PUBLIC NAVIGATION
          ================================================= */

          <NavLinksWithSlidingUnderline />

        )}

      </header>


      {/* ===================================================
          ROUTES
      =================================================== */}

      <main className="app-main">

        <Routes>

          {/* =================================================
              LANDING PAGE
          ================================================= */}

          <Route
            path="/"
            element={
              <LandingPage />
            }
          />


          {/* =================================================
              FEATURES
          ================================================= */}

          <Route
            path="/features"
            element={
              <FeaturesPage />
            }
          />


          {/* =================================================
              HOW IT WORKS
          ================================================= */}

          <Route
            path="/how-it-works"
            element={
              <HowItWorksPage />
            }
          />


          {/* =================================================
              AUTH
          ================================================= */}

          <Route
            path="/auth"
            element={
              <Auth
                students={students}
                recruiters={recruiters}
                alumni={alumni}

                onLogin={
                  handleLogin
                }

                onRegister={
                  handleRegisterStudent
                }

                onRegisterRecruiter={
                  handleRegisterRecruiter
                }

                onRegisterAlumni={
                  handleRegisterAlumni
                }

                onSeedData={
                  handleSeedData
                }
              />
            }
          />


          {/* =================================================
              STUDENT PORTAL
          ================================================= */}

          <Route
            path="/student/*"
            element={

              <ProtectedRoute
                allowedRole="student"
                session={session}
              >

                {loggedInStudent ? (

                  <StudentPortal
  currentStudent={loggedInStudent}
  drives={drives}
  calendarEvents={calendarEvents}
  blogs={blogs}
  referrals={referrals}
  alumni={alumni}
  onLogout={handleLogout}
  onApply={handleApplyDrive}
  onUpdateResumeScore={handleUpdateResumeScore}
  onUpdateStudentProfile={handleUpdateStudentProfile}
/>

                ) : (

                  <Navigate
                    to="/auth?mode=login"
                    replace
                  />

                )}

              </ProtectedRoute>
            }
          />


          {/* =================================================
              RECRUITER PORTAL
          ================================================= */}

          <Route
            path="/recruiter/*"
            element={

              <ProtectedRoute
                allowedRole="recruiter"
                session={session}
              >

                {loggedInRecruiter ? (

                  <RecruiterPortal
                    recruiter={
                      loggedInRecruiter
                    }

                    students={
                      students
                    }

                    drives={
                      drives
                    }

                    onLogout={
                      handleLogout
                    }

                    onAddDrive={
                      (driveData) =>
                        handleAddDrive(
                          driveData,
                          loggedInRecruiter.id
                        )
                    }

                    onToggleDriveActive={
                      handleToggleDriveActive
                    }

                    onPromoteStudent={
                      handlePromoteStudent
                    }

                    onRejectStudent={
                      handleRejectStudent
                    }
                  />

                ) : (

                  <Navigate
                    to="/auth?mode=login"
                    replace
                  />

                )}

              </ProtectedRoute>
            }
          />


          {/* =================================================
              ADMIN / TPO PORTAL
          ================================================= */}

          <Route
            path="/admin/*"
            element={

              <ProtectedRoute
                allowedRole="admin"
                session={session}
              >

                <AdminPortal

                  students={
                    students
                  }

                  drives={
                    drives
                  }

                  calendarEvents={
                    calendarEvents
                  }

                  alumni={
                    alumni
                  }

                  onAddCalendarEvent={
                    handleAddCalendarEvent
                  }

                  onLogout={
                    handleLogout
                  }

                  onAddDrive={
                    handleAddDrive
                  }

                  onToggleDriveActive={
                    handleToggleDriveActive
                  }

                  onUpdateStudentStatus={
                    handleUpdateStudentStatus
                  }

                  onPromoteStudent={
                    handlePromoteStudent
                  }

                  onRejectStudent={
                    handleRejectStudent
                  }

                  onSeedData={
                    handleSeedData
                  }

                  onSaveFeedback={
                    saveFeedback
                  }

                  onApproveAlumni={
                    handleApproveAlumni
                  }

                  onRejectAlumni={
                    handleRejectAlumni
                  }

                />

              </ProtectedRoute>
            }
          />


          {/* =================================================
              ALUMNI PORTAL
          ================================================= */}

          <Route
            path="/alumni/*"
            element={

              <ProtectedRoute
                allowedRole="alumni"
                session={session}
              >

                {loggedInAlumni ? (

                  <AlumniPortal

                    alumni={loggedInAlumni}

                    blogs={blogs}

                    referrals={referrals}

                    onLogout={handleLogout}

                    onCreateBlog={handleAddBlog}

                    onUpdateBlog={handleUpdateBlog}

                    onDeleteBlog={handleDeleteBlog}

                    onAddReferral={handleAddReferral}

                    onToggleReferral={handleToggleReferral}

                    onUpdateProfile={handleUpdateAlumniProfile} onCreateReferral={function (_referralData: Omit<Referral, 'id' | 'alumniId' | 'postedDate'>): void {
                      throw new Error('Function not implemented.');
                    } } onUpdateReferral={function (_id: string, _data: Partial<Referral>): void {
                      throw new Error('Function not implemented.');
                    } } onDeleteReferral={function (_id: string): void {
                      throw new Error('Function not implemented.');
                    } } onAddBlog={function (_blogData: Omit<Blog, 'id' | 'alumniId' | 'postedDate'>): void {
                      throw new Error('Function not implemented.');
                    } }                  />

                ) : (

                  <Navigate
                    to="/auth?mode=login"
                    replace
                  />

                )}

              </ProtectedRoute>
            }
          />


          {/* =================================================
              FALLBACK
          ================================================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </main>

    </div>
  );
}


/* =========================================================
   ROOT APP
========================================================= */

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}