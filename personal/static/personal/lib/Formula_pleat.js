/**This function calculates the filter pressure drop for rectangular pleat.**/

function DP_pleat_rec (t, k, L, W, Q, Length, Width) {
	/** units: t(cm), k(cm^2), L(cm), W(cm), Q(lpm) **/
	mu = 183E-6; //viscosity of air
	K = t/k;
	U0 = (Q*1000/60)/(Length*Width);
	Um = U0*W/(W+L-3*t);
	DPm = K*mu*Um;
	x = 8/(K*L)*Math.pow(L/(W-t), 3);
	DP = DPm*(1+1.85096*x); // DP in dyn/cm^2
	DP = DP/981*10; // DP in mmH2O
	return DP;
}

/**This function calculates the filter pressure drop for triangular pleat.**/

function DP_pleat_tri (t, k, L, W, Q, Length, Width) {
	/** units: t(cm), k(cm^2), L(cm), W(cm), Q(lpm) **/
	mu = 183E-6; //viscosity of air
	K = t/k;
	theta = Math.atan((W-t)/L);
	U0 = (Q*1000/60)/(Length*Width);
	Um = U0*W*Math.cos(theta)/L;
	DPm = K*mu*Um;
	x = 32/(K*L)/Math.sin(theta)/Math.pow(Math.sin(2*theta),2);
	DP = DPm*(1+1.11228*x-0.0155254*x*x); // DP in dyn/cm^2
	DP = DP/981*10; // DP in mmH2O
	return DP;
}

/**This function calculates the filter pressure drop for triangular pleat at high flowrate.**/

function DP_pleat_tri_high (t, k, L, W, Q, Length, Width, c1, c2, m1_k, m1_p, m2_k, m2_p) {
	/** units: t(cm), k(cm^2), L(cm), W(cm), Q(lpm) **/
	mu = 183E-6; //viscosity of air
	K = t/k;
	theta = Math.atan((W-t)/L);
	U0 = (Q*1000/60)/(Length*Width);
	Um = U0*W*Math.cos(theta)/L;
	DPm = c1*Um+c2*Um*Um; // DPm in mmH2O
	x = 2/W/DPm;
	DP = DPm*(1+m1_k*Math.pow(U0,m1_p)*x+m2_k*Math.pow(U0,m2_p)*x*x); // DP in mmH2O
	return DP;
}