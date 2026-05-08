package com.chitfund.repository;

import com.chitfund.model.UserData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserDataRepository extends JpaRepository<UserData, Long> {

    Optional<UserData> findByEmail(String email);
    Optional<UserData> findByUserName(String userName);
    Optional<UserData> findByVerificationToken(String token);

    boolean existsByEmail(String email);
    boolean existsByUserName(String userName);
}