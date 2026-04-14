<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fitway, a gym CRM for Indian gym owners. Both client-side and server-side tracking were implemented. A `instrumentation-client.ts` file was created for automatic Next.js 15.3+ client initialization (with exception capture and reverse proxy support). A `lib/posthog-server.ts` helper was created for server-side tracking. The `next.config.ts` was updated with PostHog reverse proxy rewrites. User identification is wired to login and signup flows on both client and server.

| Event | Description | File |
|---|---|---|
| `gym_owner_signed_up` | Fired when a new gym owner successfully registers (server-side, with identify) | `app/api/auth/signup/route.ts` |
| `gym_owner_logged_in` | Fired when a gym owner successfully signs in (client-side, with identify) | `app/(auth)/login/page.tsx` |
| `member_added` | Fired when a gym member is successfully added, includes plan/payment properties | `components/members/add-member-form.tsx` |
| `membership_renewed` | Fired when a member's membership is successfully renewed, includes plan/payment properties | `components/members/renew-membership-form.tsx` |
| `member_updated` | Fired when a gym member's profile is updated | `components/members/edit-member-form.tsx` |
| `member_deleted` | Fired when a gym member is permanently deleted | `app/(dashboard)/members/[id]/page.tsx` |
| `plan_created` | Fired when a new membership plan is created, includes name/duration/price | `app/(dashboard)/plans/page.tsx` |
| `plan_updated` | Fired when an existing membership plan is updated | `app/(dashboard)/plans/page.tsx` |
| `plan_deleted` | Fired when a membership plan is deleted | `app/(dashboard)/plans/page.tsx` |
| `member_created_server` | Server-side event when a member is created via API | `app/api/members/route.ts` |
| `membership_renewed_server` | Server-side event when a membership is renewed via API | `app/api/members/[id]/renew/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/269217/dashboard/1463298
- **Gym Owner Signups Over Time** (daily trend): https://us.posthog.com/project/269217/insights/tJQOt9BJ
- **Members Added vs Renewals (Weekly)**: https://us.posthog.com/project/269217/insights/7z2eLDvt
- **Signup to First Member Added Funnel** (onboarding activation): https://us.posthog.com/project/269217/insights/n9ZWPxI6
- **Member Retention: Add to Renewal Funnel** (churn risk): https://us.posthog.com/project/269217/insights/NGvP3i1y
- **Membership Plan Activity** (plans created vs deleted): https://us.posthog.com/project/269217/insights/C6HOF2bQ

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
