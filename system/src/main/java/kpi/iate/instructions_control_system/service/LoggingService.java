package kpi.iate.instructions_control_system.service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface LoggingService {

    void displayRequest(HttpServletRequest request, Object body);

    void displayResponse(HttpServletRequest request, HttpServletResponse response, Object body);
}
