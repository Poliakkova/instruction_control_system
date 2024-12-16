package kpi.iate.instructions_control_system.mapper;
import java.util.HashMap;
import java.util.Map;

public class StatusMapper {
    private static final Map<String, String> statusMapping = new HashMap<>();

    static {
        statusMapping.put("CREATED", "Внесено");
        statusMapping.put("REGISTERED", "Зареєстровано");
        statusMapping.put("IN_PROGRESS", "Виконується");
        statusMapping.put("CANCELLED", "Скасовано");
        statusMapping.put("FINISHED", "Виконано");
    }

    public static String getStatusName(String statusKey) {
        return statusMapping.getOrDefault(statusKey, "Невідомий статус");
    }
}

