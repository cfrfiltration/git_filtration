# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import HttpResponse
from django.shortcuts import render
from django.views.generic import TemplateView
from .forms import ValueForm
from django.template import RequestContext
from django.http import HttpResponseRedirect
import matplotlib.pyplot as plt
import electret_plotting_function as electret_eval
import scipy.constants as sc
import numpy as np
import cvs_writer as report
import matplotlib.ticker as mtick


# Create your views here.
x = 1
def index(request):
    return render(request,'personal/index.html',{'content': ['testing','paragraph',x]})

def newtab(request):
    return render(request,'personal/newtab.html')
    
def dust(request):
    return render(request,'personal/dust loading.html')
    
def pleating(request):
    return render(request,'personal/pleating design.html')
    
def action(request):
    #file = request.FILES['myfile'].read()
    #array = []
    #array = file.split()
    #filevalue1 = array[0]
    #filevalue2 = array[1]
    #filevalue3 = array[2]
    #filevalue4 = array[3]
    
    #Keep track of which checkboxes are selected, initialized to 0, convert to 1 if selected 
    #Case and Layer names initialized to empty string, convert to actual names inputed
    w, h = 5, 5;
    cases = [0 for x in range(w)] 
    caseNames = ["" for x in range(w)]  
    layers = [[0 for x in range(w)] for y in range(h)]
    layerNames = [["" for x in range(w)] for y in range(h)]
    for caseNum in range(5):
        boxName = "box" + str(caseNum+1)
        caseName = "boxInput" + str(caseNum+1)
        try:
            cases[caseNum] = request.POST[boxName]
            caseNames[caseNum] = request.POST[caseName]
            if (cases[caseNum] == "on"):
                cases[caseNum] = 1
        except:
            pass
        for layerNum in range(5):
            if (cases[caseNum]):
                layerboxName= "layerbox" + str(layerNum+1) + "_" + str(caseNum+1)
                layerName = "layerboxInput" + str(layerNum+1) + "_" + str(caseNum+1)
                try:
                    layerNames[caseNum][layerNum] = request.POST[layerName]
                    layers[caseNum][layerNum] = request.POST[layerboxName]
                    if (layers[caseNum][layerNum] == "on"):
                        layers[caseNum][layerNum] = 1
                except:
                    pass
            
    #Initialize variables for data
    epsilon_p_input = [0 for x in range(w)]
    n_input = [0 for x in range(w)]
    T_input = [0 for x in range(w)]
    p_input = [0 for x in range(w)]
    RH_input = [0 for x in range(w)]
    U_0_input  = [0 for x in range(w)]
    alpha_input = [[0 for x in range(w)] for y in range(h)]
    d_f_input = [[0 for x in range(w)] for y in range(h)]
    epsilon_f_input = [[0 for x in range(w)] for y in range(h)]
    h_input = [[0 for x in range(w)] for y in range(h)]
    h_input_units = [[0 for x in range(w)] for y in range(h)]
    sigma_0_input = [[0 for x in range(w)] for y in range(h)]
    n_input = [0 for x in range(w)]
       
    d_p = [0 for x in range(w)]
    E = [0 for x in range(w)]
    FOM = [0 for x in range(w)]
    delta_p = [[0 for x in range(w)] for y in range(h)]
    delta_p_units = ["" for x in range(w)]
    Re_f = [[0 for x in range(w)] for y in range(h)]
    Kn_f = [[0 for x in range(w)] for y in range(h)]
    warning = [["" for x in range(w)] for y in range(h)]
    
    #UNITS:
    T_input_units = [0 for x in range(w)]
    p_input_units = [0 for x in range(w)]
    U_0_input_units = [0 for x in range(w)]
    
    notes_input = ["" for x in range(w)]
    #Data Calculation:
    #result = [0 for x in range(w)]
    for caseNum in range(5):
        if (cases[caseNum]):
            try:
                epsilon_p_input[caseNum] = float(request.POST['particlePerm_' + str(caseNum + 1)])
                if (request.POST['particleCharge_' + str(caseNum + 1)] == 'neutralized'):
                    n_input[caseNum] = request.POST['chargeInput_' + str(caseNum + 1)]
                else:
                    n_input[caseNum] = float(request.POST['chargeInput_' + str(caseNum + 1)])
                T_input[caseNum] = float(request.POST['TemperatureConstant_' + str(caseNum + 1)])
                T_input_units[caseNum] = request.POST['tempUnits_' + str(caseNum + 1)]
                p_input[caseNum] = float(request.POST['pressure_' + str(caseNum + 1)])
                p_input_units[caseNum] = request.POST['pressureUnits_' + str(caseNum + 1)]
                RH_input[caseNum] = request.POST['humidity_' + str(caseNum + 1)]
                U_0_input[caseNum] = float(request.POST['velocity_' + str(caseNum + 1)])
                U_0_input_units[caseNum] = request.POST['velocityUnits_' + str(caseNum + 1)]
                P = 1
                for layerNum in range(5):
                    if (layers[caseNum][layerNum]):
                        try:   
                            alpha_input[caseNum][layerNum] = float(request.POST['solidity_' + str(caseNum + 1) + '_' + str(layerNum + 1)])
                            d_f_input[caseNum][layerNum] = float(request.POST['fiberDiameter_' + str(caseNum + 1) + '_' + 
                                                                              str(layerNum + 1)])
                            epsilon_f_input[caseNum][layerNum] = float(request.POST['fiberPerm_' + str(caseNum + 1) + '_' + 
                                                                                    str(layerNum + 1)])
                            h_input[caseNum][layerNum] = float(request.POST['fiberThickness_' + str(caseNum + 1) + '_' + 
                                                                            str(layerNum + 1)])
                            h_input_units[caseNum][layerNum] = request.POST['thicknessUnits_' + str(caseNum + 1) + '_' + 
                                                                            str(layerNum + 1)]
                            sigma_0_input[caseNum][layerNum] = float(request.POST['chargeDensity_' + str(caseNum + 1) + '_' + 
                                                                                  str(layerNum + 1)])
                            results = electret_eval.electret_plotting_function(epsilon_p_input[caseNum],n_input[caseNum],
                                                                               T_input[caseNum],
                                                                           p_input[caseNum],U_0_input[caseNum],
                                                                           alpha_input[caseNum][layerNum],d_f_input[caseNum][layerNum],
                                                                           epsilon_f_input[caseNum][layerNum],h_input[caseNum][layerNum],
                                                                           sigma_0_input[caseNum][layerNum],T_input_units[caseNum],
                                                                           p_input_units[caseNum],U_0_input_units[caseNum],
                                                                           h_input_units[caseNum][layerNum])
                            d_p[caseNum] = results['d_p']
                            P = results['P']*P
                            delta_p[caseNum][layerNum] = results['delta_p']
                            Re_f[caseNum][layerNum] = results['Re_f']
                            Kn_f[caseNum][layerNum] = results['Kn_f']
                            warning[caseNum][layerNum] = results['warning']
                            if U_0_input_units[caseNum] == 'cm/s':
                                delta_p_units[caseNum] = 'Pa'
                                delta_p[caseNum][layerNum] = results['delta_p']
                            elif U_0_input_units[caseNum] == 'ft/min':
                                delta_p_units[caseNum] = 'in H2O'
                                delta_p[caseNum][layerNum] = results['delta_p']/249.0889
                        except:
                            return HttpResponse("Check values in layer" + str(layerNum+1) + "_" + str(caseNum+1))
                E[caseNum] = 1-P
                FOM[caseNum] =-np.log(P)/sum(delta_p[caseNum][:])
                #E[caseNum] = np.transpose(np.atleast_2d(1-P))
                #FOM[caseNum] = np.transpose(np.atleast_2d(-np.log(P)/sum(delta_p[caseNum][:])))
                try:
                    notes_input[caseNum] = request.POST['notes_' + str(caseNum + 1)]
                except:
                    pass
                
            except:
                return HttpResponse("Error! Please go back and check your values on case " + str(caseNum+1) + ".")                                           
                                                           
    #Draw Graph based on 'E' or 'FOM': 
    if request.method == 'POST' and 'Penetration' in request.POST:
        form = ValueForm(request.POST)
        #if form.is_valid():
          #return HttpResponse("TRUE")
        plt.gcf().clear()
        #plt.plot([0, 1, 2, 3], [value1, value2, value3 , value4])
        fig, ax = plt.subplots()
        for caseNum in range(5):
            if (cases[caseNum]):
                plt.semilogx(d_p[caseNum]/sc.nano,1-E[caseNum],'-',linewidth=2,label=caseNames[caseNum])
        ax.grid(True,which = 'both',zorder = 0)
        plt.ylabel('Penetration (-)')
        plt.xlabel('Particle diameter (nm)')
        plt.legend(loc=2)
        #ax.yaxis.set_major_formatter(mtick.FormatStrFormatter('%.3e'))
        plt.tight_layout()
        plt.savefig('personal/static/personal/images/test.png')
                                                   
    elif request.method == 'POST' and 'Efficiency' in request.POST:
        form = ValueForm(request.POST)
        #if form.is_valid():
          #return HttpResponse("TRUE")
        plt.gcf().clear()
        #plt.plot([0, 1, 2, 3], [value1, value2, value3 , value4])
        fig, ax = plt.subplots()
        for caseNum in range(5):
            if (cases[caseNum]):
                plt.semilogx(d_p[caseNum]/sc.nano,E[caseNum]*100,'-',linewidth=2,label=caseNames[caseNum])
        ax.grid(True,which = 'both',zorder = 0)
        plt.ylabel('Filtration efficiency (%)')
        plt.xlabel('Particle diameter (nm)')
        plt.legend(loc=3)
        ax.yaxis.set_major_formatter(mtick.FormatStrFormatter('%.10e'))
        plt.tight_layout()
        plt.savefig('personal/static/personal/images/test.png')
            
    elif request.method == 'POST' and 'FOM' in request.POST:
        form = ValueForm(request.POST)
        plt.gcf().clear()
        #plt.plot([0, 1, 2, 3], [filevalue1, filevalue2, filevalue3 , filevalue4])
        fig, ax = plt.subplots()
        for caseNum in range(5):
            if (cases[caseNum]):
                plt.semilogx(d_p[caseNum]/sc.nano,FOM[caseNum],'-',linewidth=2,label=caseNames[caseNum])
                plt.ylabel('Figure of merit ('+delta_p_units[caseNum]+'$^{-1}$)')
        ax.grid(True,which = 'both',zorder = 0)
        plt.xlabel('Particle diameter (nm)')
        plt.legend(loc=3)
        #ax.yaxis.set_major_formatter(mtick.FormatStrFormatter('%.3e'))
        plt.tight_layout()
        plt.savefig('personal/static/personal/images/test.png')
        
    #f= open("personal/static/personal/file.txt","w+")
    #f.write("Just a file")
    #f.close()
    elif request.method == 'POST' and 'Download' in request.POST:
        #return HttpResponseRedirect(request.META.get('HTTP_REFERER'),{'download':'yes'})
        report.csv_writer(layers,caseNames,epsilon_p_input,n_input,
                          T_input_units,T_input,p_input_units,p_input,RH_input,U_0_input_units,U_0_input,
                          layerNames,alpha_input,d_f_input,epsilon_f_input,h_input_units,h_input,sigma_0_input,
                          notes_input,Re_f,Kn_f,delta_p_units,delta_p,warning,d_p,E,FOM)
        return render(request, 'personal/newtab.html',{'download':1}) 
    values = {}

    for caseNum in range(5):
        values['case_' + str(caseNum+1)] = cases[caseNum]
        values['caseName_' + str(caseNum+1)] = caseNames[caseNum]
        values['particlePerm_' + str(caseNum+1)] = epsilon_p_input[caseNum]
        values['chargeInput_' + str(caseNum+1)] = n_input[caseNum]
        values['TemperatureConstant_' + str(caseNum+1)] = T_input[caseNum]
        values['pressure_' + str(caseNum+1)] = p_input[caseNum]
        values['velocity_' + str(caseNum+1)] = U_0_input[caseNum]
        values['tempUnits_' + str(caseNum+1)] = T_input_units[caseNum]
        values['pressureUnits_' + str(caseNum+1)] = p_input_units[caseNum]
        values['velocityUnits_' + str(caseNum+1)] = U_0_input_units[caseNum]
        for layerNum in range(5):
            values['layer_' + str(caseNum + 1) + '_' + str(layerNum + 1)] = layers[caseNum][layerNum]
            values['layerName_' + str(caseNum + 1) + '_' + str(layerNum + 1)] = layerNames[caseNum][layerNum]
            values['solidity_' + str(caseNum + 1) + '_' + str(layerNum + 1)] = alpha_input[caseNum][layerNum]
            values['fiberDiameter_' + str(caseNum + 1) + '_' + str(layerNum + 1)] = d_f_input[caseNum][layerNum]
            values['fiberPerm_' + str(caseNum + 1) + '_' + str(layerNum + 1)] = epsilon_f_input[caseNum][layerNum]
            values['fiberThickness_' + str(caseNum + 1) + '_' + str(layerNum + 1)] = h_input[caseNum][layerNum]
            values['thicknessUnits_' + str(caseNum + 1) + '_' + str(layerNum + 1)] = h_input_units[caseNum][layerNum]
            values['chargeDensity_' + str(caseNum + 1) + '_' + str(layerNum + 1)] = sigma_0_input[caseNum][layerNum]
            values['warning_' + str(caseNum + 1) + '_' + str(layerNum + 1)] = warning[caseNum][layerNum]
    return render(request, 'personal/action.html',values)    


        
        
        
        