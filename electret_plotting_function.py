
# coding: utf-8

# In[ ]:

def electret_plotting_function(epsilon_p_input,n_input,T_input,p_input,U_0_input,alpha_input,d_f_input,
                               epsilon_f_input,h_input,sigma_0_input,T_input_units,p_input_units,U_0_input_units,h_input_units):

    import numpy as np
    import scipy.constants as sc
    import scipy.optimize as so
    import math
    import sutherland_formula as viscosity
    import willekes_relation as mean_free_path
    import electret_evaluation as eval_results
    import air_density as rho
# Declare values for inputs which should come from website
    #epsilon_p_material = 'input'
    #T_input_units = 'K'
    #p_input_units = 'atm'
    #U_0_input_units = 'cm/s'

# use_d_f_deltap right now has no input field in the website. We can decide later whether to add it.
    use_d_f_delta_p = 'no'
    d_f_input_units = 'um'
    #epsilon_f_material = 'input'
    #h_input_units = 'mm'
    sigma_0_input_units = 'uC/m**2'

# not sure if these material values should be stored here or in HTML	
    #if epsilon_p_material == 'input':
        #epsilon_p = epsilon_p_input
    #elif epsilon_p_material == 'dioctyl sebacate':
        #epsilon_p = 4.05
    #elif epsilon_p_material == 'metal':
        #epsilon_p = math.inf
    #elif epsilon_p_material == 'polystyrene':
        #epsilon_p = 2.55
    #elif epsilon_p_material == 'potassium chloride':
        #epsilon_p = 4.86
    #elif epsilon_p_material == 'silicon dioxide':
        #epsilon_p = 3.76
    #elif epsilon_p_material == 'sodium chloride':
        #epsilon_p = 5.92
    if T_input_units == 'K':
        T = T_input
    elif T_input_units == 'C':
        T = sc.convert_temperature(T_input,'C','K')
    elif T_input_units == 'F':
        T = sc.convert_temperature(T_input,'F','K')  
        
    if p_input_units == 'kPa':
        p = p_input*sc.kilo
    elif p_input_units == 'atm':
        p = p_input*sc.atm

# RH is unused now
    #RH = RH_input

    epsilon_g = 1.001

    if U_0_input_units == 'cm/s':
        U_0 = U_0_input*sc.centi
    elif U_0_input_units == 'ft/min':
        U_0 = U_0_input*sc.foot/sc.minute

    alpha = alpha_input

    if d_f_input_units == 'um':
        d_f = d_f_input*sc.micro
        if use_d_f_delta_p == 'yes':
            d_f_delta_p = d_f_delta_p_input*sc.micro
        elif use_d_f_delta_p == 'no':
            d_f_delta_p = d_f

# values might be stored in HTML
    #if epsilon_f_material == 'input':
        #epsilon_f = epsilon_f_input
    #elif epsilon_f_material == 'polybutylene terephthalate':
        #epsilon_f = 3.4
    #elif epsilon_f_material == 'polycarbonate':
        #epsilon_f = 3.1
    #elif epsilon_f_material == 'polychlorotrifluoroethylene':
        #epsilon_f = 2.72
    #elif epsilon_f_material == 'polyethylene':
        #epsilon_f = 2.25
    #elif epsilon_f_material == 'polymethylpentene':
        #epsilon_f = 2.4
    #elif epsilon_f_material == 'polypropylene':
        #epsilon_f = 2.28
    #elif epsilon_f_material == 'polystyrene':
        #epsilon_f = 2.55
    #elif epsilon_f_material == 'polytetrafluoroethylene':
        #epsilon_f = 2.1

    if h_input_units == 'mm':
        h = h_input*sc.milli
    elif h_input_units == 'mils':
        h = h_input*sc.mil

    if sigma_0_input_units == 'uC/m**2':
        sigma_0 = sigma_0_input*sc.micro

    d_p_start = 1e-9
    d_p_end = 1e-6
    points_per_decade = 64
    log10_d_p_start = np.log10(d_p_start)
    log10_d_p_end = np.log10(d_p_end)
    log10_d_p_num = (np.floor(log10_d_p_end)-np.ceil(log10_d_p_start)+1)*points_per_decade
    d_p_array = np.transpose(np.atleast_2d(np.logspace(log10_d_p_start,log10_d_p_end,num=log10_d_p_num,endpoint=True,base=10.0)))
    
    mu_g = viscosity.sutherland_formula(T)
    lambda_g = mean_free_path.willekes_relation(p,T)
    rho_g = rho.air_density(p,T)
    results_of_eval = eval_results.electret_evaluation(alpha,d_f,d_f_delta_p,h,epsilon_f_input,sigma_0,lambda_g,T,mu_g,rho_g,U_0,
                                                       epsilon_g,d_p_array,d_p_start,d_p_end,epsilon_p_input,n_input)
    results = {'d_p': d_p_array,'P': results_of_eval['P'],'delta_p': results_of_eval['delta_p'], 'Re_f': results_of_eval['Re_f'],
              'Kn_f': results_of_eval['Kn_f'], 'warning': results_of_eval['warning']}
    return results