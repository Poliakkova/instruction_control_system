package kpi.iate.instructions_control_system.parser;

import kpi.iate.instructions_control_system.exception.WrongDateString;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Component
public class StringToDateLongParser {
    public Long parseStringToGetLongTime(final String time){
        if(time.matches("(([0-2]{1})([0-9]{1})\\.([1]{1})([0-2]{1})\\.([0-9]{4}))|(([0-2]{1})([0-9]{1})\\.([0]{1})([0-9]{1})\\.([0-9]{4}))|((([3]{1})([0-1]{1}))\\.([1]{1})([0-2]{1})\\.([0-9]{4}))|((([3]{1})([0]{1}))\\.([0-9]{1})([0-2]{1})\\.([0-9]{4}))")){

            int days = Integer.parseInt(time.substring(0,2));
            int months = Integer.parseInt(time.substring(3,5));
            int years = Integer.parseInt(time.substring(6));

            LocalDateTime ldt = LocalDateTime.of(years, months, days+1, 0, 0, 0);
            ZonedDateTime zdt = ldt.atZone(ZoneId.of("Europe/Kiev"));
            long millis = zdt.toInstant().toEpochMilli();
            return millis;
        } else throw new WrongDateString("Entered date string is incorrect, the format is dd.mm.yyyyy!");
    }
}
