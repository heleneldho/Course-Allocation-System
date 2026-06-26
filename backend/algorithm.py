import math

def is_valid_pref(p):
    """Helper function to validate preference values."""
    return p is not None and p in [1, 2, 3, 4, 5]

def allocate_courses(courses, faculty, pref_matrix, counts, caps, prev_pd=None, prev_taught=None):
    """
    Main algorithm for Faculty-Course Assignment.
    """
    # -------------------------------------------------------------
    # INITIALIZATION & PREPROCESSING
    # -------------------------------------------------------------
    assigned_courses = {f: 0 for f in faculty} # A_i
    total_dissatisfaction = {f: 0 for f in faculty} # D_i
    
    assignments = {c: [] for c in courses}
    remaining_counts = {c: counts[c] for c in courses}
    
    # Handle historical data for Tie-Break 0
    if not prev_pd: prev_pd = {f: 0 for f in faculty}
    if not prev_taught: prev_taught = {f: 1 for f in faculty}
    
    avg_pd = {}
    for f in faculty:
        avg_pd[f] = prev_pd[f] / (prev_taught[f] if prev_taught[f] > 0 else 1)
    
    max_avg_pd = max(avg_pd.values()) if max(avg_pd.values()) > 0 else 1
    lambda_i = {f: avg_pd[f] / max_avg_pd for f in faculty}

    # Compute Dissatisfaction Matrix (d_ij)
    d_ij = {f: {} for f in faculty}
    for f in faculty:
        for c in courses:
            pref = pref_matrix.get(f, {}).get(c)
            if is_valid_pref(pref):
                d_ij[f][c] = pref - 1
            else:
                d_ij[f][c] = math.inf # Forbidden Assignment

    # Helper to calculate dynamic eligible faculty for a course
    def get_eligible_faculty(course):
        eligible = []
        for f in faculty:
            if d_ij[f][course] != math.inf and assigned_courses[f] < caps[f]:
                eligible.append(f)
        return eligible

    # -------------------------------------------------------------
    # STEP 1: INITIAL FEASIBILITY CHECK
    # -------------------------------------------------------------
    for c in courses:
        eligible_fac = get_eligible_faculty(c)
        if len(eligible_fac) < remaining_counts[c]:
            raise ValueError(f"\n❌ Infeasible Problem: Course {c} requires {remaining_counts[c]} faculty, but only {len(eligible_fac)} eligible faculty meet the constraints.")

    # -------------------------------------------------------------
    # MAIN ASSIGNMENT LOOP (Dynamic Reordering & Allocation)
    # -------------------------------------------------------------
    while any(remaining_counts[c] > 0 for c in courses):
        active_courses = [c for c in courses if remaining_counts[c] > 0]
        
        course_metrics = {}
        for c in active_courses:
            eligible_fac = get_eligible_faculty(c)
            slack = len(eligible_fac) - remaining_counts[c]
            
            valid_prefs = [pref_matrix[f][c] for f in eligible_fac if is_valid_pref(pref_matrix.get(f, {}).get(c))]
            avg_pref = sum(valid_prefs) / len(eligible_fac) if eligible_fac else math.inf
            
            course_metrics[c] = {'slack': slack, 'avg_pref': avg_pref}
        
        # STEP 2: COURSE ORDERING
        def course_sorting_key(c):
            slack = course_metrics[c]['slack']
            is_critical = 1 if slack <= 1 else 0
            return (-is_critical, slack, course_metrics[c]['avg_pref'])
        
        active_courses.sort(key=course_sorting_key)
        target_course = active_courses[0]
        
        # -------------------------------------------------------------
        # STEP 3: FACULTY SELECTION
        # -------------------------------------------------------------
        pool = get_eligible_faculty(target_course)
        pool = [f for f in pool if f not in assignments[target_course]]
        
        if not pool:
            raise ValueError(f"\n❌ Allocation failed: No available eligible faculty left for {target_course}.")

        fac_scores = {}
        for f in pool:
            d = d_ij[f][target_course]
            a = assigned_courses[f]
            ad = 0 if a == 0 else (total_dissatisfaction[f] / a)
            score = d - ad
            fac_scores[f] = score
        
        min_score = min(fac_scores.values())
        candidates = [f for f in pool if fac_scores[f] == min_score]
        
        # --- TIE BREAKING RULES ---
        # Rule 0: Historical Dissatisfaction
        if len(candidates) > 1:
            max_lambda = max(lambda_i[f] for f in candidates)
            candidates = [f for f in candidates if lambda_i[f] == max_lambda]
            
        # Rule 1: Fairness Gap
        if len(candidates) > 1:
            best_gap = math.inf
            gap_candidates = []
            for f in candidates:
                sim_D = total_dissatisfaction.copy()
                sim_D[f] += d_ij[f][target_course]
                gap = max(sim_D.values()) - min(sim_D.values())
                if gap < best_gap:
                    best_gap = gap
                    gap_candidates = [f]
                elif gap == best_gap:
                    gap_candidates.append(f)
            candidates = gap_candidates

        # Rule 2: Workload Balance
        if len(candidates) > 1:
            max_rem_cap = max(caps[f] - assigned_courses[f] for f in candidates)
            candidates = [f for f in candidates if (caps[f] - assigned_courses[f]) == max_rem_cap]
            
        # Rule 3: Remaining Preference Sum
        if len(candidates) > 1:
            rem_courses = [c for c in courses if remaining_counts[c] > 0 and c != target_course]
            max_r_i = -math.inf
            pref_candidates = []
            for f in candidates:
                pref_sum = sum(pref_matrix.get(f, {}).get(c, 0) for c in rem_courses if is_valid_pref(pref_matrix.get(f, {}).get(c)))
                denom = caps[f] - assigned_courses[f]
                r_i = pref_sum / denom if denom > 0 else 0
                if r_i > max_r_i:
                    max_r_i = r_i
                    pref_candidates = [f]
                elif r_i == max_r_i:
                    pref_candidates.append(f)
            candidates = pref_candidates

        selected_faculty = candidates[0]
        
        # COMMIT ASSIGNMENT
        assignments[target_course].append(selected_faculty)
        remaining_counts[target_course] -= 1
        total_dissatisfaction[selected_faculty] += d_ij[selected_faculty][target_course]
        assigned_courses[selected_faculty] += 1

    return assignments, total_dissatisfaction

# ==========================================
# INTERACTIVE TERMINAL TESTING
# ==========================================
if __name__ == "__main__":
    print("=== Course Allocation Algorithm Tester ===\n")
    
    # 1. Input Courses
    courses_in = input("Enter course names separated by commas (e.g. C1, C2, C3): ")
    course_list = [c.strip() for c in courses_in.split(",") if c.strip()]
    
    # 2. Input Faculty
    faculty_in = input("Enter faculty names separated by commas (e.g. Prof A, Prof B): ")
    faculty_list = [f.strip() for f in faculty_in.split(",") if f.strip()]
    
    # 3. Input Course Requirements
    course_requirements = {}
    print("\n--- Enter Requirements for Each Course ---")
    for c in course_list:
        while True:
            try:
                count = int(input(f"How many faculties are needed for {c}?: "))
                course_requirements[c] = count
                break
            except ValueError:
                print("Please enter a valid integer.")
                
    # 4. Input Faculty Capacities
    faculty_capacities = {}
    print("\n--- Enter Maximum Course Capacity for Faculty ---")
    for f in faculty_list:
        while True:
            try:
                cap = int(input(f"Max courses {f} can teach?: "))
                faculty_capacities[f] = cap
                break
            except ValueError:
                print("Please enter a valid integer.")

    # 5. Input Preference Matrix
    preferences = {f: {} for f in faculty_list}
    print("\n--- Enter Faculty Preferences (1 to 5, or leave blank/press Enter to skip/forbid) ---")
    print("Note: Preference values must be unique per faculty.")
    
    for f in faculty_list:
        print(f"\nSetting preferences for {f}:")
        used_prefs = set()
        for c in course_list:
            while True:
                pref_val = input(f"  Preference for {c} (1=Highest, 5=Lowest, Enter to skip): ").strip()
                if pref_val == "":
                    # Skips preference tracking -> Treated as forbidden
                    break
                try:
                    p = int(pref_val)
                    if p not in [1, 2, 3, 4, 5]:
                        print("    ⚠️ Preference must be between 1 and 5.")
                        continue
                    if p in used_prefs:
                        print(f"    ⚠️ You already gave a preference of {p} to another course. Preferences must be unique!")
                        continue
                    
                    preferences[f][c] = p
                    used_prefs.add(p)
                    break
                except ValueError:
                    print("    ⚠️ Enter a valid number or leave blank.")

    # Execute and output results
    try:
        final_schedule, final_dissatisfaction = allocate_courses(
            courses=course_list,
            faculty=faculty_list,
            pref_matrix=preferences,
            counts=course_requirements,
            caps=faculty_capacities
        )
        
        print("\n" + "="*40)
        print(f"{'Course':<15} {'Assigned Faculty(s)'}")
        print("="*40)
        for course, fac_assigned in final_schedule.items():
            fac_str = ", ".join(fac_assigned) if fac_assigned else "None (Unassigned)"
            print(f"{course:<15} {fac_str}")
            
        #print("\nFinal Dissatisfaction Metrics:")
        #for fac, dis in final_dissatisfaction.items():
            #print(f" - {fac}: {dis}")
            
    except ValueError as e:
        print(e)