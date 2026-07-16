# Executive Summary

Meridian Components' inventory dashboard is functional but incomplete. The 2024 engagement left behind a working Vue/FastAPI application, but three gaps are actively costing the operations team: unresolved defects in the Reports module, no way to translate stock and demand signals into a purchasing decision, and no automated test coverage — which has left Meridian IT unwilling to approve further changes to the system at all.

We understand the priority order Meridian has set: get Reports working correctly, give operations a Restocking tool that turns stock levels, demand forecasts, and budget into actionable purchase order recommendations, and put enough automated browser test coverage in place that IT can safely approve future changes. Architecture documentation is part of doing this responsibly — we can't safely extend a system we haven't first understood and written down for Meridian's own team.

Our approach is incremental and additive. We will not rewrite the application. We will audit and fix the Reports module in place, build Restocking as a new view on the existing API and data patterns, and add end-to-end tests for the flows operations relies on most: the core dashboard, Reports, and the new Restocking view. Architecture documentation happens early, both to accelerate our own onboarding and to give Meridian IT something durable regardless of who maintains this system next.

If time and budget allow within the fixed fee, we will also address the desired items — a modern visual refresh, extending internationalization to the remaining modules (directly benefiting the Tokyo team), and an operator-selectable dark mode for warehouse floor stations. These are scoped as options, not commitments, so that the required work is never put at risk to deliver them.

We are proposing this as a fixed-fee engagement, phased to match Meridian's stated priorities, so that Director Okafor's team has cost and schedule predictability from day one.
